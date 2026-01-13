import WorkspaceLayout from "../components/workspace/WorkspaceLayout";
import FileExplorer from "../components/workspace/FileExplorer";
import MonacoEditor from "../components/workspace/MonacoEditor";
import TerminalPanel from "../components/workspace/TerminalPanel";
import { useState } from "react";

export default function ProjectWorkspace() {
    const [code, setCode] = useState("// Start coding...");
    const [tree] = useState([
        {
            name: "src",
            type: "folder",
            children: [{ name: "index.ts", type: "file" }],
        },
    ]);

    return (
        <WorkspaceLayout
            sidebar={
                <FileExplorer
                    tree={tree as any}
                    onSelect={() => { }}
                    onCreateFile={() => { }}
                    onCreateFolder={() => { }}
                />
            }
            editor={<MonacoEditor value={code} onChange={setCode} />}
            terminal={<TerminalPanel />}
        />
    );
}
