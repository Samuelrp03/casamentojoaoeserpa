import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-cream">
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>
      <div className="flex-1 overflow-x-auto">
        {children}
      </div>
    </div>
  );
}