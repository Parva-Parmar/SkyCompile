export default function EditorTabs({
    openFiles,
    activeFile,
    isDirty,
    onSelect,
    onClose,
}: {
    openFiles: string[];
    activeFile: string | null;
    isDirty: (path: string) => boolean;
    onSelect: (path: string) => void;
    onClose: (path: string) => void;
}) {
    return (
        <div className="flex bg-[#1e1e1e] border-b border-[#333]">
            {openFiles.map((file) => {
                const name = file.split("/").pop();

                return (
                    <div
                        key={file}
                        onClick={() => onSelect(file)}
                        className={`px-3 py-2 flex items-center gap-2 cursor-pointer
              ${activeFile === file ? "bg-[#252526]" : "hover:bg-[#2a2a2a]"}`}
                    >
                        <span className="text-sm">
                            {name}
                            {isDirty(file) && (
                                <span className="ml-1 text-yellow-400">●</span>
                            )}
                        </span>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose(file);
                            }}
                            className="hover:text-red-400"
                        >
                            ✕
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
