interface SidebarProps {
    active: string;
    setActive: (value: string) => void;
}

export default function Sidebar({ active, setActive }: SidebarProps) {
    const itemClass = (name: string) =>
        `p-2 rounded cursor-pointer transition-colors ${active === name
            ? "bg-[var(--accent)] text-white"
            : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)]"
        }`;

    return (
        <aside className="w-64 bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] min-h-screen p-4">
            <h2 className="font-semibold text-[var(--text-primary)] mb-4">Dashboard</h2>

            <ul className="space-y-2">
                <li className={itemClass("profile")} onClick={() => setActive("profile")}>
                    Profile
                </li>
                <li className={itemClass("projects")} onClick={() => setActive("projects")}>
                    Projects
                </li>
                <li className={itemClass("friends")} onClick={() => setActive("friends")}>
                    Friends
                </li>
            </ul>
        </aside>
    );
}
