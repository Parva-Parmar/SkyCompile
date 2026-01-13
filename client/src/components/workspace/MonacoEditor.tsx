import Editor from "@monaco-editor/react";

export default function MonacoEditor({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <Editor
            height="100%"
            theme="vs-dark"
            language="typescript"
            value={value}
            onChange={(v) => onChange(v || "")}
            options={{
                fontSize: 14,
                minimap: { enabled: true },
                wordWrap: "on",
                automaticLayout: true,
            }}
        />
    );
}
