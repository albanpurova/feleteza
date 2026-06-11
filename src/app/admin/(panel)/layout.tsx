import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <AdminSidebar email={session.email} />
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
