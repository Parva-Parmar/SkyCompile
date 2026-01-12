export default function DashboardNavbar() {
    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">
                    SkyCompile Dashboard
                </h1>

                <button className="text-sm text-white bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600">
                    Logout
                </button>
            </div>
        </header>
    );
}
