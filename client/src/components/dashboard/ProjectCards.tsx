import type { Project } from "../../api/projects";

interface Props {
    projects: Project[];
    onDelete: (id: string) => void; // ✅ UUID
}

export default function ProjectCards({ projects, onDelete }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((project, index) => (
                <div
                    key={project.id}
                    className="border rounded p-4 flex justify-between items-center"
                >
                    <div>
                        <p className="text-sm text-gray-500">#{index + 1}</p>
                        <h3 className="font-semibold">{project.name}</h3>
                    </div>

                    <button
                        onClick={() => onDelete(project.id)} // ✅ string
                        className="text-red-500 hover:text-red-700"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}
