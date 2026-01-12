import { useState } from "react";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import MainPanel from "../components/dashboard/MainPanel";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar />

      <div className="flex">
        <Sidebar active={activeSection} setActive={setActiveSection} />
        <MainPanel active={activeSection} />
      </div>
    </div>
  );
}
