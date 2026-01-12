export default function ProjectCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {["Active Editors", "Commits Today", "Collaborators"].map(
                (title, i) => (
                    <div
                        key={i}
                        className="bg-white p-6 rounded-lg shadow"
                    >
                        <h3 className="text-gray-500 text-sm">{title}</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">
                            {Math.floor(Math.random() * 10)}
                        </p>
                    </div>
                )
            )}
        </div>
    );
}
