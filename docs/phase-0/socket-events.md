# SkyCompile Socket.IO – Phase 0 Documentation

> This document describes the **current Socket.IO events** used by the SkyCompile backend.
>  
> ⚠️ No behavior changes were introduced while creating this documentation.
> This document represents the **Socket contract frozen at Phase 0**.

---

## Conventions

- Transport: Socket.IO (WebSocket + fallback)
- Namespace: `/`
- Authentication: Implicit (JWT already validated via REST)
- Payload format: JSON
- Scope: Terminal execution & filesystem notifications

## Connection Lifecycle
**Event**: `connection`

**Direction**: Server → Client (implicit)
**Description**: Fired when a client establishes a Socket.IO connection.
**Side Effects**: 
    - Initializes an in-memory session map keyed by `socket.id`
    - Enables terminal-related events
**Event**: `disconnect`

**Direction**: Client → Server
**Description**: Fired when a socket disconnects.

**Behavior**:
    - Kills all active PTY processes associated with the socket
    - Deletes all terminal sessions for that socket
**Side Effects**:
    - Terminates running shell processes
    - Releases server resources

***Migration Risk***: 🔴 High (process lifecycle management)

## Terminal Events

**Event**: `terminal:start`

**Direction**: Client → Server
**Description**: Starts a new terminal session for a project.

**payload**

```json
{
  "projectId": "string",
  "userId": "string",
  "terminalId": "string"
}
```

**Behavior**:
    - Creates a PTY shell process (`bash` or `powershell`)
    - Sets working directory to the project root
    - Stores terminal session in memory per socket
    - Ignores request if `terminalId` already exists

**Server-side Details**:
    - Shell: `bash` (Linux/macOS) or `powershell.exe` (Windows)
    - CWD: `getProjectRoot(userId, projectId)`
    - PTY managed via `node-pty`

**Emits**:
    - `terminal:data` (on output)

**Side Effects**:
    - Spawns OS-level shell process
    - Direct filesystem access
    - Environment variables overridden (`HOME`)

**Migration Risk: 🔴 Very High**
    - OS process spawning
    - Filesystem coupling
    - Not horizontally scalable
    - Cannot be replicated directly in Go without redesign

**Event**: `terminal:data`

**Direction**: Server → Client

**Description**: Sends terminal output data to the client.

**Payload**

```json
{
  "terminalId": "string",
  "data": "string"
}
```

**Trigger**
    - Fired whenever the PTY process emits output

**Notes**
    - Raw terminal output
    - No buffering or throttling
    - Emitted only to the originating socket

**Event** `terminal:input`

**Direction** Client → Server

**Description** Sends user input to an active terminal session.

**Payload**

```json
{
  "terminalId": "string",
  "input": "string"
}
```

**Behavior** 
    - Writes input directly to the PTY stdin
    - No validation or sanitization

**Failure Modes**
    - If terminal session does not exist → input is ignored silently

**Migration Risk: 🔴 High**
    - Tight coupling to PTY
    - Assumes persistent in-memory state

**Session Model (Important)**
    - Terminal sessions are stored in-memory
    - Keyed by:
        - `socket.id`
        - `terminalId`
    - No persistence
    - No recovery after disconnect
    - No cross-instance compatibility

**Filesystem Change Events**
    Defined in `index.ts`, not in `terminal.manager.ts

**Event** `files:changed`

**Direction** Server → Client

**Description** Broadcasts filesystem changes in project directories.

**Payload**
```json
{
  "event": "string",
  "path": "string"
}
```

**Trigger** 
    - Emitted by `chokidar` watcher
    - Fired on any file change under `skycompiler_projects`

**Broadcast Scope**
    - Emitted to all connected clients
    - No project-level filtering

**Migration Risk: 🔴 High**
    - Filesystem watcher
    - Global broadcast
    - No authorization scoping

**Migration Risk Summary**
| Area                   | Risk         |
| ---------------------- | ------------ |
| Terminal execution     | 🔴 Very High |
| PTY process management | 🔴 Very High |
| In-memory sessions     | 🔴 High      |
| Filesystem watcher     | 🔴 High      |
| Socket auth model      | 🟡 Medium    |
