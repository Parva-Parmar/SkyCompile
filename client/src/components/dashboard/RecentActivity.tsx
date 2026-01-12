export default function RecentActivity() {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Activity
            </h3>

            <ul className="space-y-3">
                {[
                    "Parva edited main.ts",
                    "New collaborator joined",
                    "Project deployed",
                ].map((activity, i) => (
                    <li key={i} className="text-gray-600 text-sm">
                        • {activity}
                    </li>
                ))}
            </ul>
        </div>
    );
}
