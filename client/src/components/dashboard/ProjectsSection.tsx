const projects = [
    { id: 1, name: "Compiler" },
    { id: 2, name: "Chat App" },
    { id: 3, name: "AI Tool" },
];

export default function ProjectsSection() {
    return (
        <>
            <div className="flex justify-between mb-6">
                <h2 className="text-xl font-semibold">Projects</h2>
                <button className="bg-indigo-500 text-white px-4 py-2 rounded">
                    + Add Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                    <div key={project.id} className="bg-white p-5 rounded shadow">
                        <p className="text-sm text-gray-500">Project #{index + 1}</p>
                        <h3 className="text-lg font-semibold">{project.name}</h3>

                        <button className="mt-4 text-sm text-red-500 hover:underline">
                            Delete Project
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
}
