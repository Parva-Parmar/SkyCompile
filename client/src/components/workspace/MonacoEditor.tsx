import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

// Language detection based on file extension
const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
        // Web Technologies
        case 'js':
        case 'jsx':
        case 'mjs':
            return 'javascript';
        case 'ts':
        case 'tsx':
            return 'typescript';
        case 'html':
        case 'htm':
            return 'html';
        case 'css':
        case 'scss':
        case 'sass':
        case 'less':
            return 'css';
        case 'json':
            return 'json';
        case 'xml':
            return 'xml';
        
        // C/C++
        case 'c':
            return 'c';
        case 'cpp':
        case 'cxx':
        case 'cc':
        case 'c++':
            return 'cpp';
        case 'h':
            return 'c';
        case 'hpp':
        case 'hxx':
        case 'hh':
        case 'h++':
            return 'cpp';
        
        // Java
        case 'java':
            return 'java';
        
        // Python
        case 'py':
        case 'pyw':
            return 'python';
        
        // C#
        case 'cs':
            return 'csharp';
        
        // PHP
        case 'php':
        case 'phtml':
            return 'php';
        
        // Ruby
        case 'rb':
        case 'rbw':
            return 'ruby';
        
        // Go
        case 'go':
            return 'go';
        
        // Rust
        case 'rs':
            return 'rust';
        
        // Swift
        case 'swift':
            return 'swift';
        
        // Kotlin
        case 'kt':
        case 'kts':
            return 'kotlin';
        
        // Shell Scripts
        case 'sh':
        case 'bash':
        case 'zsh':
        case 'fish':
            return 'shell';
        
        // SQL
        case 'sql':
            return 'sql';
        
        // Docker
        case 'dockerfile':
            return 'dockerfile';
        
        // Markdown
        case 'md':
        case 'markdown':
            return 'markdown';
        
        // YAML
        case 'yaml':
        case 'yml':
            return 'yaml';
        
        // Configuration Files
        case 'toml':
            return 'toml';
        case 'ini':
            return 'ini';
        case 'cfg':
            return 'ini';
        
        default:
            return 'plaintext';
    }
};

// Configure IntelliSense for different languages
const configureLanguageFeatures = (language: string, editor: any) => {
    // Configure language-specific IntelliSense
    switch (language) {
        case 'javascript':
        case 'typescript':
            configureJavaScriptTypeScript(editor, language);
            break;
        case 'cpp':
        case 'c':
            configureCpp(editor, language);
            break;
        case 'python':
            configurePython(editor, language);
            break;
        case 'java':
            configureJava(editor, language);
            break;
        case 'html':
        case 'css':
            configureWebTechnologies(editor, language);
            break;
        default:
            configureBasic(editor);
    }
};

const configureJavaScriptTypeScript = (editor: any, language: string) => {
    // Basic JavaScript/TypeScript completions
    const monaco = (window as any).monaco;
    if (!monaco) return;

    monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: () => ({
            suggestions: [
                {
                    label: 'console.log',
                    kind: monaco.languages.CompletionItemKind.Method,
                    insertText: 'console.log($1);',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Output to console'
                },
                {
                    label: 'function',
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: 'function $1($2) {\n\t$3\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Function declaration'
                },
                {
                    label: 'const',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'const $1 = $2;',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Constant declaration'
                },
                {
                    label: 'let',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'let $1 = $2;',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Variable declaration'
                },
                {
                    label: 'if',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'if ($1) {\n\t$2\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If statement'
                },
                {
                    label: 'for',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'for (let $1 = 0; $1 < $2.length; $1++) {\n\t$3\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'For loop'
                }
            ]
        })
    });
};

const configureCpp = (editor: any, language: string) => {
    const monaco = (window as any).monaco;
    if (!monaco) return;

    monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: () => ({
            suggestions: [
                {
                    label: '#include',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: '#include <$1>',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Include header file'
                },
                {
                    label: 'int main()',
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: 'int main() {\n\t$1\n\treturn 0;\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Main function'
                },
                {
                    label: 'cout',
                    kind: monaco.languages.CompletionItemKind.Method,
                    insertText: 'std::cout << $1 << std::endl;',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Output to console'
                },
                {
                    label: 'cin',
                    kind: monaco.languages.CompletionItemKind.Method,
                    insertText: 'std::cin >> $1;',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Input from console'
                },
                {
                    label: 'for',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'for (int $1 = 0; $1 < $2; $1++) {\n\t$3\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'For loop'
                },
                {
                    label: 'if',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'if ($1) {\n\t$2\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If statement'
                },
                {
                    label: 'using namespace std;',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'using namespace std;',
                    documentation: 'Use standard namespace'
                }
            ]
        })
    });
};

const configurePython = (editor: any, language: string) => {
    const monaco = (window as any).monaco;
    if (!monaco) return;

    monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: () => ({
            suggestions: [
                {
                    label: 'def',
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: 'def $1($2):\n\t$3',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Function definition'
                },
                {
                    label: 'class',
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: 'class $1:\n\t$2',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Class definition'
                },
                {
                    label: 'if __name__ == "__main__":',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'if __name__ == "__main__":\n\t$1',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Main entry point'
                },
                {
                    label: 'import',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'import $1',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Import module'
                },
                {
                    label: 'print',
                    kind: monaco.languages.CompletionItemKind.Method,
                    insertText: 'print($1)',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Print to console'
                },
                {
                    label: 'for',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'for $1 in $2:\n\t$3',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'For loop'
                }
            ]
        })
    });
};

const configureJava = (editor: any, language: string) => {
    const monaco = (window as any).monaco;
    if (!monaco) return;

    monaco.languages.registerCompletionItemProvider(language, {
        provideCompletionItems: () => ({
            suggestions: [
                {
                    label: 'public static void main',
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: 'public static void main(String[] args) {\n\t$1\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Main method'
                },
                {
                    label: 'System.out.println',
                    kind: monaco.languages.CompletionItemKind.Method,
                    insertText: 'System.out.println($1);',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Print to console'
                },
                {
                    label: 'class',
                    kind: monaco.languages.CompletionItemKind.Class,
                    insertText: 'public class $1 {\n\t$2\n}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Class definition'
                }
            ]
        })
    });
};

const configureWebTechnologies = (editor: any, language: string) => {
    const monaco = (window as any).monaco;
    if (!monaco) return;

    if (language === 'html') {
        monaco.languages.registerCompletionItemProvider('html', {
            provideCompletionItems: () => ({
                suggestions: [
                    {
                        label: 'div',
                        kind: monaco.languages.CompletionItemKind.Class,
                        insertText: '<div>$1</div>',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Div element'
                    },
                    {
                        label: 'script',
                        kind: monaco.languages.CompletionItemKind.Class,
                        insertText: '<script>\n\t$1\n</script>',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Script tag'
                    },
                    {
                        label: 'link',
                        kind: monaco.languages.CompletionItemKind.Class,
                        insertText: '<link rel="stylesheet" href="$1">',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Link stylesheet'
                    }
                ]
            })
        });
    }
};

const configureBasic = (editor: any) => {
    // Basic configuration for unsupported languages
    editor.updateOptions({
        quickSuggestions: true,
        suggestOnTriggerCharacters: true,
    });
};

export default function MonacoEditor({
    value,
    onChange,
    projectId,
    path
}: {
    value: string;
    onChange: (v: string) => void;
    projectId?: string;
    path?: string;
}) {
    const editorRef = useRef<any>(null);
    const providerRef = useRef<WebsocketProvider | null>(null);
    const bindingRef = useRef<MonacoBinding | null>(null);

    const handleEditorDidMount = (editor: any, monacoInstance: any) => {
        editorRef.current = editor;

        // Detect language from file path
        const language = path ? getLanguageFromExtension(path) : 'plaintext';
        
        // Configure IntelliSense for the detected language
        configureLanguageFeatures(language, editor);

        if (import.meta.env.VITE_COLLAB_ENABLED === 'true' && projectId && path) {
            // Encode the parameters natively into the room string so y-websocket appends it as /ws/projectId_encodedPath
            const roomName = `${projectId}_${btoa(path)}`;
            
            const doc = new Y.Doc();
            const provider = new WebsocketProvider(
                "ws://localhost:8082/ws",
                roomName,
                doc
            );
            
            const type = doc.getText("monaco");
            const binding = new MonacoBinding(
                type,
                editor.getModel(),
                new Set([editor]),
                provider.awareness
            );

            providerRef.current = provider;
            bindingRef.current = binding;
        }
    };

    useEffect(() => {
        return () => {
             bindingRef.current?.destroy();
             providerRef.current?.destroy();
        };
    }, [projectId, path]);

    return (
        <div className="h-full w-full">
            {import.meta.env.VITE_COLLAB_ENABLED === 'true' ? (
                <Editor
                    height="100%"
                    theme="vs-dark"
                    language={path ? getLanguageFromExtension(path) : 'plaintext'}
                    onMount={handleEditorDidMount}
                />
            ) : (
                <Editor
                    height="100%"
                    theme="vs-dark"
                    language={path ? getLanguageFromExtension(path) : 'plaintext'}
                    value={value}
                    onChange={(v) => onChange(v || "")}
                    onMount={handleEditorDidMount}
                />
            )}
        </div>
    );
}
