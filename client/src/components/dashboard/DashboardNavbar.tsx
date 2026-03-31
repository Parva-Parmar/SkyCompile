import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../api/auth";

export default function DashboardNavbar() {
    const user = getCurrentUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
    };
    return (
        <header className="bg-[var(--bg-secondary)] shadow border-b border-[var(--border-color)]">
            <div className="px-6 py-4 flex items-center justify-between">

                {/* LEFT */}
                <div className="text-md font-medium text-[var(--text-muted)]">
                    Welcome, {user?.firstname || user?.name || 'User'}
                </div>

                {/* CENTER */}
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-[var(--text-primary)]">
                    SkyCompile Dashboard
                </h1>

                {/* RIGHT */}
                <button
                    onClick={handleLogout}
                    className="bg-[var(--accent)] text-white px-4 py-2 rounded hover:bg-[var(--accent-hover)] transition-colors"
                >
                    Logout
                </button>

            </div>
        </header>

    );
}
