import FileNodeView from "./FileNode";
import type { FileNode } from "../../types/file";

export default function FileExplorer({
    tree,
    onSelect,
    onCreateFile,
    onCreateFolder,
    onDelete,
    onRename,
}: {
    tree: FileNode[];
    onSelect: (path: string) => void;
    onCreateFile: () => void;
    onCreateFolder: () => void;
    onDelete: (path: string) => void;
    onRename: (oldPath: string, newPath: string) => void;
}) {
    return (
        <div className="h-full p-2 text-sm">
            <div className="flex justify-between mb-2">
                <span className="font-semibold">EXPLORER</span>
                <div className="space-x-2">
                    <button onClick={onCreateFile}>📄</button>
                    <button onClick={onCreateFolder}>📁</button>
                </div>
            </div>

            {tree.map((node) => (
                <FileNodeView
                    key={node.name}
                    node={node}
                    path=""
                    onSelect={onSelect}
                    onDelete={onDelete}
                    onRename={onRename}
                />
            ))}
        </div>
    );
}
