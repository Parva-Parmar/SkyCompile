import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { socket } from "../../socket";

export default function TerminalPanel({
    projectId,
    userId,
    terminalId,
}: {
    projectId: string;
    userId: string;
    terminalId: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!ref.current) return;

        const resizeObserver = new ResizeObserver(() => {
            const cols = Math.floor(ref.current!.clientWidth / 8);
            const rows = Math.floor(ref.current!.clientHeight / 18);

            socket.emit("terminal:resize", {
                terminalId,
                cols,
                rows,
            });
        });

        resizeObserver.observe(ref.current);

        return () => resizeObserver.disconnect();
    }, [terminalId]);

    useEffect(() => {
        if (!ref.current || !terminalId) return;

        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            theme: {
                background: "#1e1e1e",
                foreground: "#d4d4d4",
            },
        });

        term.open(ref.current);
        term.focus();

        socket.emit("terminal:start", {
            projectId,
            userId,
            terminalId,
        });

        const onData = ({
            terminalId: id,
            data,
        }: {
            terminalId: string;
            data: string;
        }) => {
            if (id === terminalId) {
                term.write(data);
            }
        };

        socket.on("terminal:data", ({ terminalId: id, data }) => {
            if (id === terminalId) {
                term.write(data);
            }
        });


        term.onData((input) => {
            socket.emit("terminal:input", {
                terminalId,
                input,
            });
        });

        return () => {
            socket.off("terminal:data", onData);
            term.dispose();
        };
    }, [projectId, userId, terminalId]);

    return <div ref={ref} className="h-full w-full" />;
}
