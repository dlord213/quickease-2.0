import Sidebar from "@/components/(admin)/Sidebar";
import { Outlet, useLoaderData, useLocation } from "react-router";
import { Toaster } from "sonner";

export default function AdminLayout() {
  const data = useLoaderData();
  const { pathname } = useLocation();

  return (
    <>
      <Toaster position="top-right" />
      <main className="flex flex-col lg:flex-row min-h-screen bg-base-200">
        <Sidebar tab={pathname} />
        <Outlet />
      </main>
    </>
  );
}
