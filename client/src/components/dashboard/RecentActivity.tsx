export default function RecentActivity() {
    return (
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg shadow border border-[var(--border-color)]">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                Recent Activity
            </h3>

            <ul className="space-y-3">
                {[
                    "Parva edited main.ts",
                    "New collaborator joined",
                    "Project deployed",
                ].map((activity, i) => (
                    <li key={i} className="text-[var(--text-muted)] text-sm">
                        • {activity}
                    </li>
                ))}
            </ul>
        </div>
    );
}
