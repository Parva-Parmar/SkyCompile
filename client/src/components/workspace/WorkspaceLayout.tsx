export default function WorkspaceLayout({
    header,
    sidebar,
    editor,
    terminal,
    collaborators,
}: {
    header?: React.ReactNode;
    sidebar: React.ReactNode;
    editor: React.ReactNode;
    terminal: React.ReactNode;
    collaborators?: React.ReactNode;
}) {
    return (
        <div className="h-screen flex flex-col bg-[var(--workspace-bg)] text-[var(--text-primary)] transition-colors duration-300">
            {header && (
                <div className="h-10 border-b border-[var(--border-color)] flex items-center">
                    {header}
                </div>
            )}
            <div className="flex flex-1 overflow-hidden flex h-full">
                <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--sidebar-bg)]">
                    {sidebar}
                </aside>

                <main className="flex-1 flex flex-col overflow-hidden">
                    {editor}
                </main>

                {collaborators && (
                    <aside className="w-80 border-l border-[var(--border-color)] bg-[var(--sidebar-bg)]">
                        {collaborators}
                    </aside>
                )}
            </div>

            <div className="h-64 border-t border-[var(--border-color)] bg-[var(--panel-bg)]">
                {terminal}
            </div>
        </div>
    );
}
