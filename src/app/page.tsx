import { LoginButton } from "@/components/auth/LoginButton";
import { getServerAuthSession } from "@/lib/auth";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">NextAuth.js XenForo Demo</h1>
        <p>
          {session ? (
            <>Welcome, {session.user?.name}!</>
          ) : (
            <>Please sign in to continue</>
          )}
        </p>
      </div>
      
      <LoginButton />
      
      {session && (
        <div className="mt-8 p-4 border rounded bg-gray-50 max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Session Info</h2>
          <pre className="overflow-auto text-sm">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
