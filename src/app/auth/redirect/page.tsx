import { stackServerApp } from "@/lib/stack";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
  const user = await stackServerApp.getUser({ or: "return-null" });

  if (!user) {
    redirect("/handler/sign-in");
  }

  // DEBUG — ver qué trae el metadata
  console.log("=== AUTH REDIRECT DEBUG ===");
  console.log("email:", user.primaryEmail);
  console.log("clientMetadata:", JSON.stringify(user.clientMetadata));
  console.log("serverMetadata:", JSON.stringify(user.serverMetadata));
  console.log("===========================");

  const metadata = user.clientMetadata as { role?: string } | null;

  if (metadata?.role === "admin") {
    redirect("/admin");
  }

  redirect("/producto");
}