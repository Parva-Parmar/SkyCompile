import type { Project } from "../../api/projects";

interface Props {
    projects: Project[];
    onDelete: (id: string) => void;
    onOpen: (id: string) => void; // ✅ ADD
}

export default function ProjectCards({
    projects,
    onDelete,
    onOpen,
}: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((project, index) => (
                <div
                    key={project.id}
                    onClick={() => onOpen(project.id)} // ✅ OPEN WORKSPACE
                    className="border rounded p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                >
                    <div>
                        <p className="text-sm text-gray-500">#{index + 1}</p>
                        <h3 className="font-semibold">{project.name}</h3>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // 🚨 IMPORTANT
                            onDelete(project.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}
