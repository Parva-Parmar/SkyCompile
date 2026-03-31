export default function TerminalTabs({
    terminals,
    activeTerminal,
    onSelect,
    onClose,
    onCreate,
}: {
    terminals: string[];
    activeTerminal: string | null;
    onSelect: (id: string) => void;
    onClose: (id: string) => void;
    onCreate: () => void;
}) {
    return (
        <div className="flex items-center border-b border-[var(--border-color)] bg-[var(--sidebar-bg)] text-sm">
            {terminals.map((id, i) => (
                <div
                    key={id}
                    onClick={() => onSelect(id)}
                    className={`px-3 py-1 flex items-center gap-2 cursor-pointer
            ${activeTerminal === id
                            ? "bg-[var(--panel-bg)] text-[var(--text-primary)]"
                            : "hover:bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                        }`}
                >
                    <span>Terminal {i + 1}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose(id);
                        }}
                        className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <button
                onClick={onCreate}
                className="ml-2 px-2 text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors text-lg font-bold"
            >
                +
            </button>
        </div>
    );
}
