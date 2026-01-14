import Editor from "@monaco-editor/react";

export default function MonacoEditor({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="h-full w-full">
            <Editor
                height="100%"
                theme="vs-dark"
                value={value}
                onChange={(v) => onChange(v || "")}
            />
        </div>
    );
}
