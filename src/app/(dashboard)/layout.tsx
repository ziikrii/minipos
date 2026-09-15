import AuthGuard from "@/components/auth/auth-guard";
import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen lg:flex">
        <div className="print:hidden">
          <Sidebar />
        </div>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
