import { Server, Socket } from "socket.io";
import * as pty from "node-pty";
import { getProjectRoot } from "../utils/projectRoot";

type TerminalSession = {
  pty: pty.IPty;
};

const sessions = new Map<
  string,
  Map<string, TerminalSession>
>();

export function setupTerminal(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("🔌 Terminal socket connected:", socket.id);

    socket.on(
      "terminal:start",
      ({
        projectId,
        userId,
        terminalId,
      }: {
        projectId: string;
        userId: string;
        terminalId: string;
      }) => {
        let socketSessions = sessions.get(socket.id);

        if (!socketSessions) {
          socketSessions = new Map();
          sessions.set(socket.id, socketSessions);
        }

        if (socketSessions.has(terminalId)) {
          console.log("⚠️ Terminal already exists:", terminalId);
          return;
        }

        const projectRoot = getProjectRoot(userId, projectId);
        console.log("📂 CWD:", projectRoot);

        const shell =
          process.platform === "win32" ? "powershell.exe" : "bash";

        const ptyProcess = pty.spawn(shell, [], {
          name: "xterm-color",
          cols: 80,
          rows: 24,
          cwd: projectRoot,
          env: {
            ...process.env,
            HOME: projectRoot,
          },
        });

        socketSessions.set(terminalId, { pty: ptyProcess });

        ptyProcess.onData((data) => {
          socket.emit("terminal:data", {
            terminalId,
            data,
          });
        });
      }
    );

    socket.on(
      "terminal:input",
      ({ terminalId, input }: { terminalId: string; input: string }) => {
        const session = sessions
          .get(socket.id)
          ?.get(terminalId);

        session?.pty.write(input);
      }
    );

    socket.on("disconnect", () => {
      const socketSessions = sessions.get(socket.id);

      socketSessions?.forEach((s) => s.pty.kill());
      sessions.delete(socket.id);

      console.log("❌ Terminal socket disconnected:", socket.id);
    });
  });
}
