import { useState } from "react";
import { v4 as uuid } from "uuid";
import type { TerminalTab } from "../../types/terminal";

export default function TerminalPanel() {
    const [tabs, setTabs] = useState<TerminalTab[]>([
        { id: uuid(), title: "Terminal 1" },
    ]);
    const [active, setActive] = useState<string>(tabs[0].id);

    // ✅ Create new terminal
    const addTerminal = () => {
        const newTab = {
            id: uuid(),
            title: `Terminal ${tabs.length + 1}`,
        };
        setTabs((prev) => [...prev, newTab]);
        setActive(newTab.id);
    };

    // ✅ Delete terminal
    const removeTerminal = (id: string) => {
        setTabs((prev) => {
            // 🚨 prevent removing last terminal (VS Code behavior)
            if (prev.length === 1) return prev;

            const updated = prev.filter((t) => t.id !== id);

            // if active tab was removed, switch to another
            if (id === active) {
                setActive(updated[updated.length - 1].id);
            }

            return updated;
        });
    };

    return (
        <div className="h-full bg-[#1e1e1e] text-sm text-white">
            {/* Tabs bar */}
            <div className="flex items-center border-b border-[#2a2a2a]">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        onClick={() => setActive(tab.id)}
                        className={`flex items-center gap-2 px-3 py-1 cursor-pointer
              ${tab.id === active ? "bg-[#252526]" : ""}
            `}
                    >
                        <span>{tab.title}</span>

                        {/* ❌ Close button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // 🚨 important
                                removeTerminal(tab.id);
                            }}
                            className="text-gray-400 hover:text-white"
                        >
                            ×
                        </button>
                    </div>
                ))}

                {/* ➕ Add terminal */}
                <button
                    onClick={addTerminal}
                    className="ml-auto px-3 text-gray-400 hover:text-white"
                >
                    +
                </button>
            </div>

            {/* Terminal content */}
            <div className="p-2">
                <div className="h-40 bg-black text-green-400 p-2">
                    Terminal Output ({active})
                </div>
            </div>
        </div>
    );
}
