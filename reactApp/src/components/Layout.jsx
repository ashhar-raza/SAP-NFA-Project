import React, { useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Moon, Sun, LogOut, ArrowLeft } from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Remove stored token
    localStorage.removeItem("oauth_token");
    localStorage.removeItem("oauth_token_expiry");
    localStorage.removeItem("email");

    // Navigate to login/dashboard page
    navigate("/");
  };
  const handleBack = () => navigate(-1);

  const hideHeader = location.pathname === "/";

  // Extract the first part of the path to set title
  const pathSegment = location.pathname.split("/")[1]; // e.g., "buyer"
  const titleMap = {
    buyer: "Buyer Dashboard",
    approver: "Approver Dashboard",
    vendor: "Vendor Dashboard",
    admin: "Admin Dashboard",
    // add more mappings if needed
  };
  const pageTitle = titleMap[pathSegment] || "Dashboard";

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      {!hideHeader && (
        <header
          className="navbar flex-nowrap justify-between items-center px-6 py-3 rounded-xl shadow-lg mb-10"
          style={{ display: "flex", flexWrap: "nowrap" }}
        >
          {/* Left: Back Button */}
          <button className="button-secondary button-back flex items-center gap-2  text-sm" onClick={handleBack}>
            <ArrowLeft size={20} /> Back
          </button>

          {/* Center: Dynamic Heading */}
          <h2 className="font-bold text-md text-center flex-1 select-none">
            {pageTitle}
          </h2>

          {/* Right: Controls */}
          <div className="flex items-center gap-3">
            {/* <button className="button-primary  flex items-center gap-2 px-4 py-2 text-sm" onClick={toggleTheme}>
              {theme === "light" ? <><Moon size={20} /> Dark</> : <><Sun size={20} /> Light</>}
            </button> */}

            <button className="button-destructive button-logout flex items-center gap-2 px-4 py-2 text-sm" onClick={handleLogout}>
              <LogOut size={20} /> Logout
            </button>
          </div>
        </header>
      )}

      <main className=" margin-10px" style={{ margin: "0 20px 20px", padding: "5px 10px" }}>
        <Outlet />
      </main>
    </div>
  );
}
