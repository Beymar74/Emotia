export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";

export default async function ProveedoresPage() {
  redirect("/admin/usuarios?tab=representantes");
}