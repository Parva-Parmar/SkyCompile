export default function WorkspaceLayout({
    header,
    sidebar,
    editor,
    terminal,
}: {
    header?: React.ReactNode;
    sidebar: React.ReactNode;
    editor: React.ReactNode;
    terminal: React.ReactNode;
}) {
    return (
        <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
            {header && (
                <div className="h-10 border-b border-[#2a2a2a] flex items-center">
                    {header}
                </div>
            )}
            <div className="flex flex-1 overflow-hidden flex h-full">
                <aside className="w-64 border-r border-[#2a2a2a]">
                    {sidebar}
                </aside>

                <main className="flex-1 flex flex-col overflow-hidden">
                    {editor}
                </main>
            </div>

            <div className="h-64 border-t border-[#2a2a2a]">
                {terminal}
            </div>
        </div>
    );
}
