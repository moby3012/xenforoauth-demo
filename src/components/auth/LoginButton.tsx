"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p>Signed in as {session.user?.name}</p>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }
  
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={() => signIn("xenforo")}
    >
      Sign in with XenForo
    </button>
  );
}
