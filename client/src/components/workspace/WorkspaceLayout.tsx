export default function WorkspaceLayout({
    sidebar,
    editor,
    terminal,
}: {
    sidebar: React.ReactNode;
    editor: React.ReactNode;
    terminal: React.ReactNode;
}) {
    return (
        <div className="h-screen flex flex-col bg-[#1e1e1e] text-white">
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 border-r border-[#2a2a2a]">
                    {sidebar}
                </aside>

                <main className="flex-1 flex flex-col">
                    {editor}
                </main>
            </div>

            <div className="h-64 border-t border-[#2a2a2a]">
                {terminal}
            </div>
        </div>
    );
}
