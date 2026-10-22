import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SidebarNav from "../components/SidebarNav";

// Layout for all authenticated pages (navbar always visible)
const AppLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="terra-shell min-h-screen">
      <SidebarNav />
      <main className="min-h-screen pt-16 transition-all duration-300 lg:fixed lg:inset-y-0 lg:left-[250px] lg:right-0 lg:pt-0 lg:overflow-y-auto">
        <div className="w-full px-4 py-6 sm:px-6 lg:px-0 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
