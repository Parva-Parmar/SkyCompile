import type { FileNode } from "../../types/file";
import { useState } from "react";

export default function FileNodeView({
    node,
    path,
    onSelect,
    onDelete,
    onRename,
}: {
    node: FileNode;
    path: string;
    onSelect: (path: string) => void;
    onDelete: (path: string) => void;
    onRename: (oldPath: string, newPath: string) => void;
}) {
    const [open, setOpen] = useState(true);

    const fullPath = `${path}/${node.name}`;

    // ---- Rename handler ----
    const handleRename = (e: React.MouseEvent) => {
        e.stopPropagation();

        const newName = prompt("Rename to:", node.name);
        if (!newName || newName === node.name) return;

        const newPath = `${path}/${newName}`;
        onRename(fullPath, newPath);
    };

    // ---- Delete handler ----
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (confirm(`Delete "${node.name}"?`)) {
            onDelete(fullPath);
        }
    };

    // -------- Folder --------
    if (node.type === "folder") {
        return (
            <div className="ml-2">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-[#2a2a2a] px-1"
                    onClick={() => setOpen(!open)}
                >
                    <span>📁 {node.name}</span>

                    <button
                        onClick={handleRename}
                        className="text-xs opacity-60 hover:opacity-100"
                    >
                        ✏️
                    </button>

                    <button
                        onClick={handleDelete}
                        className="text-xs opacity-60 hover:opacity-100"
                    >
                        🗑️
                    </button>
                </div>

                {open &&
                    node.children?.map((child) => (
                        <FileNodeView
                            key={child.name}
                            node={child}
                            path={fullPath}
                            onSelect={onSelect}
                            onDelete={onDelete}
                            onRename={onRename}
                        />
                    ))}
            </div>
        );
    }

    // -------- File --------
    return (
        <div
            className="ml-6 flex items-center gap-2 cursor-pointer hover:bg-[#2a2a2a] px-1"
            onClick={() => onSelect(fullPath)}
        >
            <span>📄 {node.name}</span>

            <button
                onClick={handleRename}
                className="text-xs opacity-60 hover:opacity-100"
            >
                ✏️
            </button>

            <button
                onClick={handleDelete}
                className="text-xs opacity-60 hover:opacity-100"
            >
                🗑️
            </button>
        </div>
    );
}
