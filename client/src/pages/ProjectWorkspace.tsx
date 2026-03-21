import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import FileExplorer from "../components/workspace/FileExplorer";
import MonacoEditor from "../components/workspace/MonacoEditor";
import TerminalPanel from "../components/workspace/TerminalPanel";
import EditorTabs from "../components/workspace/EditorTabs";
import TerminalTabs from "../components/workspace/TerminalTabs";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";

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
    const [terminals, setTerminals] = useState<string[]>([]);
    const [activeTerminal, setActiveTerminal] = useState<string | null>(null);

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
    const createTerminal = () => {
        const id = crypto.randomUUID();
        setTerminals((prev) => [...prev, id]);
        setActiveTerminal(id);
    };
    useEffect(() => {
        if (terminals.length === 0) {
            createTerminal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const closeTerminal = (id: string) => {
        socket.emit("terminal:close", { terminalId: id });

        setTerminals((prev) => prev.filter((t) => t !== id));

        if (activeTerminal === id) {
            setActiveTerminal((prev) =>
                prev === id ? null : prev
            );
        }
    };
    useEffect(() => {
        socket.on("files:changed", loadTree);

        return () => {
            socket.off("files:changed", loadTree);
        };
    }, [projectId]);
    const navigate = useNavigate();

    const exitWorkspace = () => {
        navigate("/dashboard");
    };



    return (
        <WorkspaceLayout
            header={
                <div className="flex items-center gap-3 px-4">
                    <button
                        onClick={exitWorkspace}
                        className="text-sm text-gray-300 hover:text-white flex items-center gap-1"
                    >
                        ← Back to Projects
                    </button>

                    <span className="text-xs text-gray-500">
                        Project Workspace
                    </span>
                </div>
            }
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

                    <div className="flex-1 overflow-hidden relative">
                        {import.meta.env.VITE_COLLAB_ENABLED === 'true' ? (
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#1e1e1e] text-orange-400 bg-opacity-90 flex-col gap-2">
                                <span className="animate-pulse font-bold text-lg">⚠️ Collaborative Editor Mode ⚠️</span>
                                <span className="text-xs text-gray-400 max-w-sm text-center">
                                    Real-time Yjs syncing is currently behind a feature flag for stability rollout testing. 
                                    Please set VITE_COLLAB_ENABLED=false in your .env to fallback to the stable HTTP REST pipeline.
                                </span>
                            </div>
                        ) : null}

                        <MonacoEditor
                            value={code}
                            onChange={onCodeChange}
                        />
                    </div>
                </div>
            }

            terminal={
                <div className="h-full flex flex-col">

                    {/* Terminal Toolbar */}
                    <div className="flex items-center justify-end gap-3 px-3 py-1 border-b border-[#2a2a2a] bg-[#1e1e1e] text-sm">
                        <button
                            disabled={!activeTerminal}
                            onClick={() => {
                                if (!activeTerminal) return;
                                socket.emit("terminal:input", {
                                    terminalId: activeTerminal,
                                    input: "clear\n",
                                });
                            }}
                            className="text-gray-300 hover:text-white disabled:opacity-40"
                        >
                            Clear
                        </button>

                        <button
                            disabled={!activeTerminal}
                            onClick={() => {
                                if (!activeTerminal) return;
                                socket.emit("terminal:input", {
                                    terminalId: activeTerminal,
                                    input: "exit\n",
                                });
                            }}
                            className="text-red-400 hover:text-red-300 disabled:opacity-40"
                        >
                            Exit
                        </button>
                    </div>
                    {/* Terminal Tabs */}
                    <TerminalTabs
                        terminals={terminals}
                        activeTerminal={activeTerminal}
                        onSelect={setActiveTerminal}
                        onClose={closeTerminal}
                        onCreate={createTerminal}
                    />

                    {/* Active Terminal */}
                    <div className="flex-1 relative overflow-hidden">
                        {terminals.map((id) => (
                            <div
                                key={id}
                                className={`absolute inset-0 ${activeTerminal === id ? "block" : "hidden"
                                    }`}
                            >
                                <TerminalPanel
                                    projectId={projectId!}
                                    userId={JSON.parse(
                                        atob(localStorage.getItem("token")!.split(".")[1])
                                    ).userId}
                                    terminalId={id}
                                />
                            </div>
                        ))}
                    </div>

                </div>
            }


        />
    );
}
