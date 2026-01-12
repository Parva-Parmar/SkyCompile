interface SidebarProps {
    active: string;
    setActive: (value: string) => void;
}

export default function Sidebar({ active, setActive }: SidebarProps) {
    const itemClass = (name: string) =>
        `p-2 rounded cursor-pointer ${active === name
            ? "bg-indigo-500 text-white"
            : "text-gray-600 hover:bg-indigo-100"
        }`;

    return (
        <aside className="w-64 bg-white border-r min-h-screen p-4">
            <h2 className="font-semibold text-gray-700 mb-4">Dashboard</h2>

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
