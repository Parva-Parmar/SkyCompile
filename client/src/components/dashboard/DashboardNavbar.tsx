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
        <header className="bg-white shadow">
            <div className="px-6 py-4 flex items-center justify-between">

                {/* LEFT */}
                <div className="text-md font-medium text-gray-700">
                    Welcome, {user?.firstname}
                </div>

                {/* CENTER */}
                <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-800">
                    SkyCompile Dashboard
                </h1>

                {/* RIGHT */}
                <button
                    onClick={handleLogout}
                    className="bg-purple-600 text-white px-4 py-2 rounded"
                >
                    Logout
                </button>

            </div>
        </header>

    );
}
