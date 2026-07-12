"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const Dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/login");
    },
  });

  if (status === "loading") {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      {session?.user ? (
        <>
          <h1>Bonjour {session.user.name ?? session.user.email}</h1>
          <button onClick={() => signOut({ callbackUrl: "/login" })}>
            Déconnexion
          </button>
        </>
      ) : (
        <Link href="/login">
          <button>Connexion</button>          
        </Link>
      )}
    </div>
  );
};

export default Dashboard;
