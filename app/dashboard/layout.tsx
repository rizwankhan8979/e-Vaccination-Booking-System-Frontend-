import React from "react"
import DashboardLayout from '../../components/layouts/DashboardLayout';
import '../../styles/main.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
