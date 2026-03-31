import { useEffect, useRef } from "react";
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
                    ws.send("\n");
                }
            };

            ws.onclose = (event) => {
                isConnecting = false;
                if (!event.wasClean && reconnectTimeout === null && connectionAttempts < maxConnectionAttempts) {
                    term.write("\r\n\x1b[33m[Connection lost unexpectedly. Retrying in 3s...]\x1b[0m\r\n");
                    reconnectTimeout = setTimeout(() => {
                        reconnectTimeout = null;
                        connectWebSocket();
                    }, 3000);
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

        const handleWheel = (event: WheelEvent) => {
            // Allow smooth scrolling with mouse wheel
            if (event.deltaY < 0) {
                term.scrollLines(-1);
            } else {
                term.scrollLines(1);
            }
        };

        // Add event listeners
        ref.current.addEventListener('focus', handleTerminalFocus);
        ref.current.addEventListener('wheel', handleWheel, { passive: true });

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
                ref.current.removeEventListener('wheel', handleWheel);
            }
            term.dispose();
        };
    }, [projectId, userId]);

    return <div ref={ref} className="h-full w-full terminal-container" />;
}
