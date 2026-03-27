// Legacy socket.io has been decommissioned in favor of Native WebSockets in Go.
// This dummy object safely intercepts legacy events built into the React tree.

class DummySocket {
    on(event: string, cb: any) {}
    off(event: string, cb: any) {}
    emit(event: string, payload?: any) {}
}

export const socket = new DummySocket();
