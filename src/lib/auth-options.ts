// src/lib/auth-options.ts
import type { NextAuthOptions } from "next-auth";

const siteUrl = process.env.XENFORO_SITE_URL;

export const authOptions: NextAuthOptions = {
  // Copy your entire authOptions configuration from route.ts here
  providers: [
    {
      id: "xenforo",
      name: "XenForo",
      type: "oauth",
      clientId: process.env.XENFORO_CLIENT_ID as string,
      clientSecret: process.env.XENFORO_CLIENT_SECRET as string,
      
      /**
       * Authorization configuration
       * Uses PKCE flow for increased security
       * Requests scopes for reading user data, alerts, and profile posts
       */
      authorization: {
        url: `${siteUrl}/oauth2/authorize`,
        params: {
          scope: "user:read alert:read profile_post:read",
          response_type: "code",
          code_challenge_method: "S256"
        }
      },
      
      /**
       * Token exchange implementation
       * Handles OAuth code for token exchange and fetches user profile data
       */
      token: {
        url: `${siteUrl}/api/oauth2/token`,
        async request({ provider, params, checks }) {
          // Get the token endpoint URL
          const tokenEndpoint = typeof provider.token === 'object' 
            ? provider.token.url 
            : provider.token;
          
          // Prepare token request parameters
          const tokenParams = new URLSearchParams();
          tokenParams.append("grant_type", "authorization_code");
          tokenParams.append("client_id", provider.clientId as string);
          tokenParams.append("client_secret", provider.clientSecret as string);
          tokenParams.append("redirect_uri", provider.callbackUrl as string);
          tokenParams.append("code", params.code as string);
          
          // Add PKCE code verifier if available
          if (checks?.code_verifier) {
            tokenParams.append("code_verifier", checks.code_verifier);
          }
          
          try {
            if (!tokenEndpoint) {
              throw new Error("Token endpoint URL is undefined");
            }
              
            // Exchange authorization code for tokens
            const response = await fetch(tokenEndpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json"
              },
              body: tokenParams,
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorText}`);
            }
            
            const tokens = await response.json();

            // Fetch user profile data using the access token
            try {
              const userResponse = await fetch(`${siteUrl}/api/me`, {
                headers: {
                  Authorization: `Bearer ${tokens.access_token}`,
                  Accept: "application/json"
                },
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                
                // XenForo stores user data in the 'me' property
                const userInfo = userData.me;
                if (userInfo) {
                  // Store user data in the tokens object for later use
                  tokens.profile = {
                    sub: userInfo.user_id?.toString() || "unknown",
                    name: userInfo.username || "Unknown User",
                    email: userInfo.email || null,
                    avatar_url: userInfo.avatar_urls?.o || userInfo.avatar_urls?.l || null
                  };
                }
              }
            } catch (userError) {
              // Continue with token exchange even if user info fetch fails
              console.warn("Error getting user info:", userError);
            }
            
            return {
              tokens,
              response
            };
          } catch (error) {
            console.error("Token exchange error:", error);
            throw error;
          }
        }
      },
      
      /**
       * User info endpoint implementation
       * Acts as a fallback if profile data wasn't already fetched during token exchange
       */
      userinfo: {
        url: `${siteUrl}/api/me`,
        async request({ tokens }) {
          // If we already have profile data from the token exchange, use it
          if (tokens.profile) {
            return tokens.profile;
          }
          
          // Fallback: fetch user profile data now
          try {
            if (!tokens.access_token) {
              throw new Error("No access token available");
            }
            
            const response = await fetch(`${siteUrl}/api/me`, {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                Accept: "application/json"
              },
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`HTTP error! Status: ${response.status}. Response: ${errorText}`);
            }
            
            const data = await response.json();
            
            // XenForo stores user data in the 'me' property
            const userInfo = data.me;
            if (!userInfo) {
              return {
                sub: "unknown",
                name: "Unknown User"
              };
            }
            
            // Format the response to match what NextAuth expects
            return {
              sub: userInfo.user_id?.toString() || "unknown",
              name: userInfo.username || "Unknown User",
              email: userInfo.email || null,
              avatar_url: userInfo.avatar_urls?.o || userInfo.avatar_urls?.l || null
            };
          } catch (error) {
            console.error("User info request error:", error);
            // Return minimal profile data to avoid breaking the flow
            return {
              sub: "unknown",
              name: "Unknown User"
            };
          }
        }
      },
      
      /**
       * Profile mapping function
       * Converts XenForo user data to NextAuth user profile format
       */
      profile(profile) {
        return {
          id: profile.sub || "unknown",
          name: profile.name || profile.username || "Unknown User",
          email: profile.email,
          image: profile.avatar_url || profile.picture
        };
      },
      
      // Security checks to implement
      checks: ["pkce", "state"]
    }
  ],
  callbacks: {
    /**
     * JWT callback
     * Stores access token and user information in the JWT
     */
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        
        // If we have a profile, store user data too
        if (profile) {
          token.xenforoId = profile.sub || "unknown";
          token.name = profile.name;
        }
      }
      return token;
    },
    
    /**
     * Session callback
     * Makes token data available in the client-side session
     */
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (session.user) {
        session.user.id = token.xenforoId as string || "unknown";
        // Set name if missing
        if (!session.user.name && token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  debug: false
};
