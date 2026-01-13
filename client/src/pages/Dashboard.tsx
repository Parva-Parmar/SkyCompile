import { useState } from "react";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import MainPanel from "../components/dashboard/MainPanel";
 

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState(() => {
    return localStorage.getItem("activeSection") || "profile";
  });

  const handleSetActive = (section: string) => {
    setActiveSection(section);
    localStorage.setItem("activeSection", section);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar />

      <div className="flex">
        <Sidebar active={activeSection} setActive={handleSetActive} />
        <MainPanel active={activeSection} />
      </div>
    </div>
  );
}
