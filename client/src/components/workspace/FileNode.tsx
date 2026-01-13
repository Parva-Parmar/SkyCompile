import type { FileNode } from "../../types/file";
import { useState } from "react";

export default function FileNodeView({
    node,
    path,
    onSelect,
}: {
    node: FileNode;
    path: string;
    onSelect: (path: string) => void;
}) {
    const [open, setOpen] = useState(true);
    const fullPath = `${path}/${node.name}`;

    if (node.type === "folder") {
        return (
            <div className="ml-2">
                <div onClick={() => setOpen(!open)}>📁 {node.name}</div>
                {open &&
                    node.children?.map((child) => (
                        <FileNodeView
                            key={child.name}
                            node={child}
                            path={fullPath}
                            onSelect={onSelect}
                        />
                    ))}
            </div>
        );
    }

    return (
        <div
            className="ml-6 cursor-pointer hover:bg-[#2a2a2a]"
            onClick={() => onSelect(fullPath)}
        >
            📄 {node.name}
        </div>
    );
}
