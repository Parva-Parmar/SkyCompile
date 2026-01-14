import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import FileExplorer from "../components/workspace/FileExplorer";
import MonacoEditor from "../components/workspace/MonacoEditor";
import TerminalPanel from "../components/workspace/TerminalPanel";
import EditorTabs from "../components/workspace/EditorTabs";


import {
    getFileTree,
    getFileContent,
    saveFileContent,
    createFile,
    createFolder,
} from "../api/files";
import {
    deleteEntry,
    renameEntry,
} from "../api/files";


import type { FileNode } from "../types/file";

export default function ProjectWorkspace() {
    const { projectId } = useParams<{ projectId: string }>();

    const [tree, setTree] = useState<FileNode[]>([]);
    const [openFiles, setOpenFiles] = useState<string[]>([]);
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [code, setCode] = useState<string>("");
    const [savedContent, setSavedContent] = useState<Record<string, string>>({});
    const [buffers, setBuffers] = useState<Record<string, string>>({});


    // Load file tree
    const loadTree = async () => {
        if (!projectId) return;
        const data = await getFileTree(projectId);
        setTree(data);
    };

    useEffect(() => {
        if (!projectId || !activeFile) return;

        const timer = setTimeout(async () => {
            const current = buffers[activeFile];
            if (current === undefined) return;

            await saveFileContent(projectId, activeFile, current);

            setSavedContent((prev) => ({
                ...prev,
                [activeFile]: current,
            }));
        }, 800);

        return () => clearTimeout(timer);
    }, [buffers, activeFile]);



    useEffect(() => {
        loadTree();
    }, [projectId]);

    const isFileDirty = (path: string) => {
        return (
            buffers[path] !== undefined &&
            savedContent[path] !== undefined &&
            buffers[path] !== savedContent[path]
        );
    };

    // Open file
    const openFile = async (path: string) => {
        setOpenFiles((prev) =>
            prev.includes(path) ? prev : [...prev, path]
        );

        setActiveFile(path);

        // If already in buffer, reuse it
        if (buffers[path] !== undefined) {
            setCode(buffers[path]);
            return;
        }

        // Otherwise load from backend
        const content = await getFileContent(projectId!, path);

        setBuffers((prev) => ({ ...prev, [path]: content }));
        setSavedContent((prev) => ({ ...prev, [path]: content }));
        setCode(content);
    };



    // Save file (called by Monaco)
    const onCodeChange = (value: string) => {
        if (!activeFile) return;

        setCode(value);
        setBuffers((prev) => ({
            ...prev,
            [activeFile]: value,
        }));
    };



    // Create new file
    const onCreateFile = async () => {
        if (!projectId) return;
        const name = prompt("Enter file path (e.g. src/index.ts)");
        if (!name) return;
        await createFile(projectId, `/${name}`);
        loadTree();
    };

    // Create new folder
    const onCreateFolder = async () => {
        if (!projectId) return;
        const name = prompt("Enter folder path (e.g. src/components)");
        if (!name) return;
        await createFolder(projectId, `/${name}`);
        loadTree();
    };

    const onDelete = async (path: string) => {
        if (!projectId) return;

        await deleteEntry(projectId, path);
        await loadTree();

        // Optional UX: close editor if deleted file was open
        if (activeFile === path) {
            setActiveFile(null);
            setCode("");
        }
    };

    const onRename = async (
        oldPath: string,
        newPath: string
    ) => {
        if (!projectId) return;

        await renameEntry(projectId, oldPath, newPath);
        await loadTree();

        // Optional UX: keep editor open on rename
        if (activeFile === oldPath) {
            setActiveFile(newPath);
        }
    };
    const closeTab = (path: string) => {
        setOpenFiles((prev) => {
            const remaining = prev.filter((p) => p !== path);

            // If the closed tab was active, switch intelligently
            if (activeFile === path) {
                setActiveFile(remaining.length ? remaining[remaining.length - 1] : null);
                setCode("");
            }

            return remaining;
        });
    };


    const switchTab = (path: string) => {
        setActiveFile(path);
        setCode(buffers[path] ?? "");
    };




    return (
        <WorkspaceLayout
            sidebar={
                <FileExplorer
                    tree={tree}
                    onSelect={openFile}
                    onCreateFile={onCreateFile}
                    onCreateFolder={onCreateFolder}
                    onDelete={onDelete}
                    onRename={onRename}
                />

            }
            editor={
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="shrink-0">
                        <EditorTabs
                            openFiles={openFiles}
                            activeFile={activeFile}
                            isDirty={isFileDirty}
                            onSelect={switchTab}
                            onClose={closeTab}
                        />

                    </div>

                    <div className="flex-1 overflow-hidden">
                        <MonacoEditor
                            value={code}
                            onChange={onCodeChange}
                        />
                    </div>
                </div>
            }

            terminal={<TerminalPanel />}
        />
    );
}
