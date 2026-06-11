import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export default function TerminalPanel({
    projectId,
    userId,
    onFileChange,
    theme,
}: {
    projectId: string;
    userId: string;
    onFileChange?: () => void;
    theme: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const termRef = useRef<Terminal | null>(null);
    const [isDisconnected, setIsDisconnected] = useState(false);
    const [reconnectTrigger, setReconnectTrigger] = useState(0);

    useEffect(() => {
        if (termRef.current) {
            termRef.current.options.theme = {
                background: theme === "dark" ? "#1e1e1e" : "#f8fafc",
                foreground: theme === "dark" ? "#d4d4d4" : "#0f172a",
                cursor: theme === "dark" ? "#ffffff" : "#000000",
            };
        }
    }, [theme]);

    useEffect(() => {
        if (!ref.current) return;

        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            scrollback: 1000, // Allow 1000 lines of scrollback
            theme: {
                background: theme === "dark" ? "#1e1e1e" : "#f8fafc",
                foreground: theme === "dark" ? "#d4d4d4" : "#0f172a",
                cursor: theme === "dark" ? "#ffffff" : "#000000",
            },
        });
        
        termRef.current = term;

        term.open(ref.current);
        term.focus();

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    // Calculate terminal dimensions based on font size
                    const fontSize = 14;
                    const charWidth = fontSize * 0.6; // Approximate character width
                    const charHeight = fontSize * 1.2; // Approximate character height with line spacing
                    
                    const cols = Math.floor(width / charWidth);
                    const rows = Math.floor(height / charHeight);
                    
                    if (cols > 0 && rows > 0) {
                        term.resize(cols, rows);
                    }
                }
            }
        });
        resizeObserver.observe(ref.current);

        let ws: WebSocket | null = null;
        let reconnectTimeout: number | null = null;
        let isConnecting = false;
        let connectionAttempts = 0;
        const maxConnectionAttempts = 3;

        const connectWebSocket = () => {
            if (isConnecting || connectionAttempts >= maxConnectionAttempts) {
                return;
            }

            if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
                return;
            }

            isConnecting = true;
            connectionAttempts++;
            
            ws = new WebSocket(`ws://localhost:8082/terminal?projectId=${projectId}&userId=${userId}`);
            
            ws.onmessage = (event) => {
                const data = event.data;
                if (typeof data === "string") {
                    term.write(data, () => {
                        // Auto-scroll to bottom only if user isn't manually scrolling
                        if (!isUserScrolling) {
                            term.scrollToBottom();
                        }
                    });
                } else if (data instanceof Blob) {
                    data.text().then(text => {
                        term.write(text, () => {
                            // Auto-scroll to bottom only if user isn't manually scrolling
                            if (!isUserScrolling) {
                                term.scrollToBottom();
                            }
                        });
                    });
                }
            };

            ws.onopen = () => {
                isConnecting = false;
                connectionAttempts = 0; // Reset on successful connection
                term.write("\r\n\x1b[32m[SkyCompile Native Gateway]: Connected successfully.\x1b[0m\r\n");
                // Hit enter to display the bash prompt cleanly
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send("\r");
                }
            };

            ws.onclose = (event) => {
                isConnecting = false;
                if (!event.wasClean && reconnectTimeout === null && connectionAttempts < maxConnectionAttempts) {
                    term.write("\r\n\x1b[33m[Connection lost unexpectedly. Retrying in 3s...]\x1b[0m\r\n");
                    reconnectTimeout = window.setTimeout(() => {
                        reconnectTimeout = null;
                        connectWebSocket();
                    }, 3000);
                } else if (connectionAttempts >= maxConnectionAttempts || event.wasClean) {
                    setIsDisconnected(true);
                    term.write("\r\n\x1b[31m[Connection permanently closed.]\x1b[0m\r\n");
                }
            };

            ws.onerror = (error) => {
                isConnecting = false;
                if (connectionAttempts === 1) { // Only show error on first attempt
                    term.write("\r\n\x1b[31m[WebSocket error]: Check if backend server is running on port 8082\x1b[0m\r\n");
                    console.error('WebSocket error:', error);
                }
            };
        };

        // Add a small delay to prevent rapid reconnections during React strict mode
        const timeoutId = setTimeout(() => {
            connectWebSocket();
        }, 100);

        // Handle terminal focus and scroll events
        const handleTerminalFocus = () => {
            term.focus();
        };

        // Add event listeners
        ref.current.addEventListener('focus', handleTerminalFocus);

        let commandBuffer = '';
        let isUserScrolling = false;
        let userScrollTimeout: number;
        
        // Detect user scrolling
        const handleUserScroll = () => {
            isUserScrolling = true;
            clearTimeout(userScrollTimeout);
            userScrollTimeout = setTimeout(() => {
                isUserScrolling = false;
            }, 1000); // Reset after 1 second of no scrolling
        };
        
        term.onScroll(() => {
            handleUserScroll();
        });
        
        term.onData((input) => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(input);
                
                // Track commands to detect file creation
                commandBuffer += input;
                
                // Check for compilation commands that create executables
                if (onFileChange && (input.includes('\r') || input.includes('\n'))) {
                    const command = commandBuffer.trim();
                    if (command.includes('g++') || command.includes('gcc') || 
                        command.includes('javac') || command.includes('python') ||
                        command.includes('touch') || command.includes('mkdir') ||
                        command.includes('cp') || command.includes('mv') ||
                        command.includes('wget') || command.includes('curl')) {
                        // Small delay to allow the command to execute and create files
                        setTimeout(() => onFileChange(), 1000);
                    }
                    
                    // Reset buffer after command execution
                    if (command.length > 0) {
                        commandBuffer = '';
                    }
                }
            }
        });

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(userScrollTimeout);
            resizeObserver.disconnect();
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (ws) {
                ws.close();
            }
            // Clean up event listeners
            if (ref.current) {
                ref.current.removeEventListener('focus', handleTerminalFocus);
            }
            term.dispose();
        };
    }, [projectId, userId, reconnectTrigger]);

    const handleReconnect = () => {
        setIsDisconnected(false);
        setReconnectTrigger(prev => prev + 1);
    };

    return (
        <div className="relative h-full w-full">
            <div ref={ref} className="h-full w-full terminal-container" />
            {isDisconnected && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                    <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-color)] shadow-xl text-center max-w-sm mx-4">
                        <div className="text-red-400 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-[var(--text-primary)] font-semibold mb-2">Connection Lost</h3>
                        <p className="text-[var(--text-muted)] text-sm mb-4">
                            The terminal connection to the server was lost after multiple attempts.
                        </p>
                        <button 
                            onClick={handleReconnect}
                            className="w-full px-4 py-2 bg-[var(--accent)] text-white rounded hover:bg-[var(--accent-hover)] transition-colors"
                        >
                            Reconnect
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
