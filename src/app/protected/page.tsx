// src/app/protected/page.tsx

import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProtectedPage() {
  const session = await getServerAuthSession();
  
  if (!session) {
    redirect("/");
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Protected Page</h1>
      <p className="mb-8">This page is only accessible to authenticated users.</p>
      
      <div className="mb-8 p-4 border rounded bg-gray-50 max-w-lg">
        <h2 className="text-xl font-semibold mb-2">User Info</h2>
        <p><strong>Name:</strong> {session.user?.name}</p>
        <p><strong>Email:</strong> {session.user?.email}</p>
        <p><strong>XenForo ID:</strong> {session.user?.id}</p>
      </div>
      
      <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">
        Back to Home
      </Link>
    </main>
  );
}
