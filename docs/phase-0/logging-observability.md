## Observed Runtime Behavior (Phase 0)

The following behaviors were observed via structured logs
during local development. No behavior changes were introduced.

### Filesystem Event Emission (chokidar)

Observation:

- A single logical file operation (create/edit/delete)
  results in multiple filesystem events.

Observed patterns:

- add → change → unlink → add
- repeated change events for the same file

Implications:

- Filesystem events are noisy and non-deterministic
- Events cannot be treated as reliable collaboration signals
- Direct mapping of FS events → UI updates is unsafe

Conclusion:

- chokidar-based signaling is acceptable only in Phase 0–3
- Must be replaced before real-time collaboration

### Terminal Lifecycle Observations

Observation:

- Terminal sessions are scoped to socket.id and terminalId
- Duplicate terminal:start events are ignored silently
- Terminal processes are killed on socket disconnect

Observed logs:

- "Terminal already exists" warnings
- PTY processes bound to project root CWD

Implications:

- Terminal sessions are not recoverable
- No persistence across reconnects
- Horizontal scaling is not possible

Conclusion:

- Terminal execution must be redesigned in Go (Phase 6)

### Execution and Filesystem Coupling

Observation:

- Terminal CWD is always the project root
- Execution reads directly from disk
- Execution observes live file changes

Observed effects:

- Compilation output interleaves with file edits
- Auto-save triggers multiple FS events during execution

Implications:

- No snapshot isolation
- Concurrent editing can affect running processes
- Execution cannot safely run from in-memory state

Conclusion:

- Snapshot-based execution required for collaboration

## Observability Summary

| Area         | Observation                             | Risk |
| ------------ | --------------------------------------- | ---- |
| Filesystem   | Multiple events per logical change      | 🔴   |
| Terminal     | Socket-scoped, non-recoverable sessions | 🔴   |
| Execution    | Live filesystem reads                   | 🔴   |
| FS Signaling | Global broadcast, no project scoping    | 🔴   |
