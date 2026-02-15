## Filesystem Root

All project data is stored on local disk under:

server/skycompiler_projects/

Code Source

    utils/projectFolder.ts

    utils/projectRoot.ts

    index.ts

const BASE_PROJECTS_DIR = path.join(process.cwd(), "skycompiler_projects");

Ownership
- Created by: Node.js backend
- Read by:
  - REST file APIs
  - Terminal execution (node-pty)
  - chokidar filesystem watcher
- Written by:
  - REST file APIs
  - Terminal execution (compiler/runtime output)


## Project Directory Layout

server/skycompiler_projects/
├── <userId>/              # UUID
│   └── <projectId>/       # UUID
│       ├── *.c / *.cpp
│       ├── *.js / *.ts
│       ├── *.py / *.txt
│       ├── a.out / main   # compiled binaries
│       └── arbitrary files


Path Rules (Enforced in Code)

From files.controller.ts:

const resolvedPath = path.resolve(projectRoot, "." + filePath);
if (!resolvedPath.startsWith(projectRoot)) {
  return res.status(403);
}

- All file paths are resolved relative to project root
- Directory traversal outside project root is blocked
- No fixed language, framework, or src/ directory
- Projects may contain arbitrary files at root

3️⃣ Directory Lifecycle (Exact Code Paths)
User Directory Creation
Function:
createUserProjectFolder(userId)

File:
utils/projectFolder.ts

Behavior:
- Creates skycompiler_projects/ if missing
- Creates per-user directory

Project Directory Creation
Trigger:
POST /api/v1/projects

Code Path:
project.controller.ts
→ project.service.ts
→ createProjectFolder()

Behavior:
- Creates project directory recursively
- No default files are created

Project Deletion
Trigger:
DELETE /api/v1/projects/:id

Code Path:
project.service.ts
→ deleteProjectFolder()

Behavior:
- Deletes entire project directory recursively
- All files are permanently removed

4️⃣ File Write Contract (Fully Enumerated)

This section proves that all write paths are identified.

Save File Content
Trigger:
PUT /projects/:projectId/files/content


Code

await fs.writeFile(resolvedPath, content, "utf-8");


Behavior

Overwrites file if exists

Creates file if missing

Side Effects

Triggers chokidar watcher

Emits files:changed


---

### Create File

```md
Trigger:
POST /projects/:projectId/files


Code

await fs.writeFile(resolvedPath, "", "utf-8");


Behavior

Creates empty file

Parent directories must already exist


---

### Create Folder

```md
Trigger:
POST /projects/:projectId/folders


Code

await fs.mkdir(resolvedPath, { recursive: true });


Behavior

Creates nested directories if needed


---

### Rename File or Folder

```md
Trigger:
PUT /projects/:projectId/files/rename


Code

await fs.mkdir(path.dirname(resolvedNew), { recursive: true });
await fs.rename(resolvedOld, resolvedNew);


Behavior

Auto-creates parent directories

Moves or renames file/folder


---

### Delete File or Folder

```md
Trigger:
DELETE /projects/:projectId/files


Code

if (stat.isDirectory()) {
  await fs.rm(resolvedPath, { recursive: true, force: true });
} else {
  await fs.unlink(resolvedPath);
}


Behavior

Files deleted directly

Folders deleted recursively


---

## 5️⃣ Terminal ↔ Filesystem Contract (Critical)

```md
## Terminal Execution Contract

Code Source

terminal/terminal.manager.ts

Execution Model
- Terminal spawned using node-pty
- Shell:
  - bash (Linux/macOS)
  - powershell.exe (Windows)
- CWD = project root directory
- HOME overridden to project root

pty.spawn(shell, [], {
  cwd: projectRoot,
  env: { ...process.env, HOME: projectRoot }
});

Filesystem Interaction
- Commands read files directly from disk
- Commands may write arbitrary files
- Compiler outputs (a.out, main, etc.) are written to disk
- No sandboxing
- No snapshot isolation


⚠️ Running processes observe live filesystem state

6️⃣ Filesystem as Event Source
## Filesystem Events

Code Source

index.ts

const watcher = chokidar.watch(PROJECTS_ROOT);
watcher.on("all", (event, filePath) => {
  io.emit("files:changed", { event, path });
});

Behavior
- Watches entire skycompiler_projects/
- Emits events for all file changes
- Broadcast to all connected sockets
- No user or project-level filtering

7️⃣ Contract Stability Matrix (Phase Lock)
## Contract Stability

Must Not Change (Phase 1)
- Filesystem root location
- userId/projectId directory scheme
- Terminal CWD resolution
- Direct disk reads during execution

May Change Later (Phase 4+)
- Filesystem as source of truth
- chokidar-based change detection
- Direct execution from disk

8️⃣ Filesystem Write Matrix (Acceptance Proof)
## Filesystem Write Matrix

| Operation            | Trigger              | Code Location               | Risk |
|---------------------|----------------------|-----------------------------|------|
| Save file content   | REST API             | files.controller.ts         | 🔴   |
| Create file         | REST API             | files.controller.ts         | 🟡   |
| Create folder       | REST API             | files.controller.ts         | 🟡   |
| Rename entry        | REST API             | files.controller.ts         | 🟡   |
| Delete entry        | REST API             | files.controller.ts         | 🟡   |
| Compile output      | terminal:start/input | terminal.manager.ts         | 🔴   |
| Runtime file writes | Program execution    | OS process                  | 🔴   |


✅ Acceptance Criteria Satisfied

Filesystem behavior fully documented

All write paths identified

Terminal coupling explicit