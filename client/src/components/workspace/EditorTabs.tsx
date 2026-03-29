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
        <div className="flex bg-[var(--sidebar-bg)] border-b border-[var(--border-color)]">
            {openFiles.map((file) => {
                const name = file.split("/").pop();

                return (
                    <div
                        key={file}
                        onClick={() => onSelect(file)}
                        className={`px-3 py-2 flex items-center gap-2 cursor-pointer
              ${activeFile === file ? "bg-[var(--workspace-bg)] border-t border-t-[var(--accent)] text-[var(--text-primary)]" : "hover:bg-[var(--bg-elevated)] text-[var(--text-muted)]"}`}
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
