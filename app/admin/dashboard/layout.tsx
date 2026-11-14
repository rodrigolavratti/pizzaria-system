import type { ReactNode } from "react";
import AdminGuard from "../AdminGuard";

const AdminDashboardLayout = ({ children }: { children: ReactNode }) => {
  return <AdminGuard>{children}</AdminGuard>;
};

export default AdminDashboardLayout;
