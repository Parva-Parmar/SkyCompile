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
        <div className="flex items-center border-b border-[#2a2a2a] bg-[#1e1e1e] text-sm">
            {terminals.map((id, i) => (
                <div
                    key={id}
                    onClick={() => onSelect(id)}
                    className={`px-3 py-1 flex items-center gap-2 cursor-pointer
            ${activeTerminal === id
                            ? "bg-[#252526]"
                            : "hover:bg-[#2a2a2a]"
                        }`}
                >
                    <span>Terminal {i + 1}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose(id);
                        }}
                        className="text-gray-400 hover:text-red-400"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <button
                onClick={onCreate}
                className="ml-2 px-2 text-green-400 hover:text-green-300"
            >
                +
            </button>
        </div>
    );
}
