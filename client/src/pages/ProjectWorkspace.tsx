import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Users } from "lucide-react";
import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import FileExplorer from "../components/workspace/FileExplorer";
import MonacoEditor from "../components/workspace/MonacoEditor";
import TerminalPanel from "../components/workspace/TerminalPanel";
import EditorTabs from "../components/workspace/EditorTabs";
import TerminalTabs from "../components/workspace/TerminalTabs";
import CollaboratorManager from "../components/workspace/CollaboratorManager";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../components/ThemeContext";

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
    downloadProjectFile,
} from "../api/files";


import type { FileNode } from "../types/file";

export default function ProjectWorkspace() {
    const { projectId } = useParams<{ projectId: string }>();
    const terminalInitialized = useRef(false);
    const { theme } = useTheme();

    const [tree, setTree] = useState<FileNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [openFiles, setOpenFiles] = useState<string[]>([]);
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [code, setCode] = useState<string>("");
    const [savedContent, setSavedContent] = useState<Record<string, string>>({});
    const [buffers, setBuffers] = useState<Record<string, string>>({});
    const [terminals, setTerminals] = useState<string[]>([]);
    const [activeTerminal, setActiveTerminal] = useState<string | null>(null);
    const [showCollaborators, setShowCollaborators] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string>("");

    // Get current user info
    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setCurrentUserId(payload.userId);
            }
        } catch (error) {
            console.error("Failed to parse token:", error);
        }
    }, []);

    // Load file tree
    const loadTree = async () => {
        if (!projectId) return;
        setIsLoading(true);
        try {
            const data = await getFileTree(projectId);
            setTree(data);
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    useEffect(() => {
        if (!projectId || !activeFile) return;

        const timer = setTimeout(async () => {
            const current = buffers[activeFile];
            if (current === undefined) return;

            try {
                await saveFileContent(projectId, activeFile, current);

                setSavedContent((prev) => ({
                    ...prev,
                    [activeFile]: current,
                }));
            } catch (error: any) {
                console.error("Failed to save:", error);
                // If it's an HTTP 403 or permission error, it's typically sent in error.message
                showToast("Viewer cannot edit files");
            }
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
        try {
            await createFile(projectId, `/${name}`);
            // Immediate refresh with small delay to ensure backend processes the change
            setTimeout(() => loadTree(), 100);
        } catch (error) {
            console.error("Failed to create file:", error);
            showToast("Viewer cannot create files");
        }
    };

    // Create new folder
    const onCreateFolder = async () => {
        if (!projectId) return;
        const name = prompt("Enter folder path (e.g. src/components)");
        if (!name) return;
        try {
            await createFolder(projectId, `/${name}`);
            // Immediate refresh with small delay to ensure backend processes the change
            setTimeout(() => loadTree(), 100);
        } catch (error) {
            console.error("Failed to create folder:", error);
            showToast("Viewer cannot create folders");
        }
    };

    const onDelete = async (path: string) => {
        if (!projectId) return;
        
        if (!confirm(`Are you sure you want to delete ${path}?`)) {
            return;
        }

        try {
            await deleteEntry(projectId, path);
            // Immediate refresh with small delay
            setTimeout(() => loadTree(), 100);

            // Optional UX: close editor if deleted file was open
            if (activeFile === path) {
                setActiveFile(null);
                setCode("");
            }
        } catch (error) {
            console.error("Failed to delete:", error);
            showToast("Viewer cannot delete files");
        }
    };

    const onRename = async (oldPath: string, newPath: string) => {
        if (!projectId) return;
        
        try {
            await renameEntry(projectId, oldPath, newPath);
            // Immediate refresh with small delay
            setTimeout(() => loadTree(), 100);

            // Optional UX: keep editor open on rename
            if (activeFile === oldPath) {
                setActiveFile(newPath);
            }
        } catch (error) {
            console.error("Failed to rename:", error);
            showToast("Viewer cannot rename files");
        }
    };

    const handleDownload = async (path?: string) => {
        if (!projectId) return;
        try {
            showToast(path ? `Downloading file...` : `Downloading project...`);
            await downloadProjectFile(projectId, path);
        } catch (error) {
            console.error("Failed to download:", error);
            showToast("Download failed. Please try again.");
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
        if (!terminalInitialized.current && terminals.length === 0) {
            terminalInitialized.current = true;
            createTerminal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const closeTerminal = (id: string) => {
        // Terminal cleanup is handled by WebSocket disconnect in TerminalPanel component
        setTerminals((prev) => prev.filter((t) => t !== id));

        if (activeTerminal === id) {
            setActiveTerminal((prev) =>
                prev === id ? null : prev
            );
        }
    };
    // Remove socket.io dependency - using immediate refresh instead
    const navigate = useNavigate();

    const exitWorkspace = () => {
        navigate("/dashboard");
    };



    return (
        <>
            {toastMessage && (
                <div className="fixed bottom-6 right-6 bg-red-500/90 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce font-medium backdrop-blur-sm border border-red-400">
                    {toastMessage}
                </div>
            )}
            <WorkspaceLayout
                header={
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-[var(--text-primary)] font-semibold">{isLoading ? "Loading..." : "Project Workspace"}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowCollaborators(!showCollaborators)}
                            className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] rounded hover:bg-[var(--glass-bg)] transition-colors"
                        >
                            <Users className="w-4 h-4" />
                            {showCollaborators ? "Hide" : "Show"} Team
                        </button>
                        <button
                            onClick={exitWorkspace}
                            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1"
                        >
                            ← Back to Projects
                        </button>
                    </div>
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
                    onDownload={handleDownload}
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
                            <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--workspace-bg)] text-orange-400 bg-opacity-90 flex-col gap-2">
                                <span className="animate-pulse font-bold text-lg">⚠️ Collaborative Editor Mode ⚠️</span>
                                <span className="text-xs text-gray-400 max-w-sm text-center">
                                    Real-time Yjs syncing is currently behind a feature flag for stability rollout testing. 
                                    Please set VITE_COLLAB_ENABLED=false in your .env to fallback to the stable HTTP REST pipeline.
                                </span>
                            </div>
                        ) : null}

                        {!activeFile ? (
                            <div className="absolute inset-0 z-40 flex items-center justify-center bg-[var(--workspace-bg)] text-[var(--text-muted)]">
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                    <p className="text-lg">Select a file from the sidebar to start coding</p>
                                </div>
                            </div>
                        ) : (
                            <MonacoEditor
                                value={code}
                                onChange={onCodeChange}
                                projectId={projectId}
                                path={activeFile}
                            />
                        )}
                    </div>
                </div>
            }

            collaborators={
                showCollaborators && projectId && currentUserId ? (
                    <CollaboratorManager
                        projectId={projectId}
                        currentUserId={currentUserId}
                    />
                ) : null
            }
            terminal={
                <div className="h-full flex flex-col">

                    {/* Terminal Toolbar */}
                    <div className="flex items-center justify-end gap-3 px-3 py-1 border-b border-[var(--border-color)] bg-[var(--sidebar-bg)] text-sm">
                        <button
                            disabled={!activeTerminal}
                            onClick={() => {
                                if (!activeTerminal) return;
                                // Clear and exit commands are handled directly in the terminal
                                // Users can type these commands directly in the terminal
                                alert("Type 'clear' in the terminal to clear the screen");
                            }}
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-40 transition-colors"
                        >
                            Clear
                        </button>

                        <button
                            disabled={!activeTerminal}
                            onClick={() => {
                                if (!activeTerminal) return;
                                // Close terminal button functionality
                                closeTerminal(activeTerminal);
                            }}
                            className="text-red-400 hover:text-red-300 disabled:opacity-40"
                        >
                            Close
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
                                    onFileChange={loadTree}
                                    theme={theme}
                                />
                            </div>
                        ))}
                    </div>

                </div>
            }
        />
        </>
    );
}
