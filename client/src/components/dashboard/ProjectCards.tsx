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
                    className="border border-[var(--border-color)] bg-[var(--bg-secondary)] rounded p-4 flex flex-col justify-between cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors"
                >
                    <div>
                        <p className="text-sm text-[var(--accent)]">#{index + 1}</p>
                        <h3 className="font-semibold text-lg text-[var(--text-primary)]">{project.name}</h3>
                        
                        {/* Owner Information */}
                        {project.owner && (
                            <div className="mt-2 text-sm text-[var(--text-muted)]">
                                <p className="font-medium text-[var(--text-primary)]">Owner:</p>
                                <p className="text-[var(--text-primary)]">{project.owner.name}</p>
                                <p className="text-xs text-[var(--text-muted)] opacity-75">{project.owner.email}</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-[var(--border-color)]">
                        <span className="text-xs text-[var(--text-muted)]">
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
