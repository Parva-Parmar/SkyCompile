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
                    className="border rounded p-4 flex flex-col justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                >
                    <div>
                        <p className="text-sm text-gray-500">#{index + 1}</p>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        
                        {/* Owner Information */}
                        {project.owner && (
                            <div className="mt-2 text-sm text-gray-600">
                                <p className="font-medium">Owner:</p>
                                <p className="text-gray-500">{project.owner.name}</p>
                                <p className="text-xs text-gray-400">{project.owner.email}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-400">
                            {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'Unknown date'}
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // 🚨 IMPORTANT
                                onDelete(project.id);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
