# NextAuth.js XenForo Demo

## Introduction
This is a Next.js application demonstrating how to implement authentication with NextAuth.js, specifically tailored for XenForo integration.

## Features
- XenForo authentication
- Session management
- Protected routes
- User profile information display

## Installation
1. Clone the repository
2. Run `npm install`
3. Create `.env` file with required environment variables

## Configuration
Set up your environment variables in `.env`, look at the example.env for reference:
```
NEXTAUTH_URL=your-website-url
NEXTAUTH_SECRET=your-secret-key
XENFORO_CLIENT_ID=your-client-id
XENFORO_CLIENT_SECRET=your-client-secret
XENFORO_SITE_URL=your-xenforo-site-url

```

## Usage
0. Set up an Oauth2 application in your XenForo admin panel and copy all the necessary values into your `.env` file and set up the Redirect URI to 'https://yoursite/api/auth/callback/xenforo'
1. Double Check your scopes
2. Client Type in Xenforo Oauth2 Client Application has to be set to Confidential
3. Fill in your environment variables in the `.env` file
4. Start the development server: `npm run dev`
5. Access the home page to login
6. View session information after login

## Protected Routes
Use the `getServerAuthSession` function to protect pages:
```typescript
const session = await getServerAuthSession();
if (!session) {
  redirect('/');
}
```

## Session Management
Access user session data in components:
```typescript
const session = await getServerAuthSession();
const userName = session.user?.name;
```
