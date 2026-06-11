import { useEffect, useState } from "react";
import EmailAutocompleteInput from "../workspace/EmailAutocompleteInput";
import {
    getFriends,
    getFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
} from "../../api/friends";

import type { Friend, FriendRequest } from "../../api/friends";


export default function FriendsSection() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // Get existing friends and their emails to exclude from suggestions
    const existingEmails = [...friends.map(f => f.email), ...requests.map(r => r.email)];

    /* =========================
       Load data
    ========================= */

    const loadAll = async () => {
        try {
            const [friendsData, requestsData] = await Promise.all([
                getFriends(),
                getFriendRequests(),
            ]);
            setFriends(friendsData);
            setRequests(requestsData);
        } catch (err) {
            console.error("Failed to load friends", err);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    /* =========================
       Actions
    ========================= */

    const handleSendRequest = async () => {
        if (!email.trim()) return;

        setLoading(true);
        try {
            await sendFriendRequest(email);
            setEmail("");
            loadAll();
        } catch (err) {
            alert("Failed to send request");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id: string) => {
        try {
            await acceptFriendRequest(id);
            loadAll();
        } catch (err: any) {
            alert(err.message || "Failed to accept friend request");
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectFriendRequest(id);
            loadAll();
        } catch (err: any) {
            alert(err.message || "Failed to reject friend request");
        }
    };

    const handleRemove = async (id: string) => {
        if (!confirm("Are you sure you want to remove this friend?")) return;
        try {
            await removeFriend(id);
            loadAll();
        } catch (err: any) {
            alert(err.message || "Failed to remove friend");
        }
    };

    /* =========================
       UI
    ========================= */

    return (
        <div className="space-y-8">
            {/* Add Friend */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-6 shadow">
                <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Add Friend</h2>
                <div className="flex gap-3">
                    <EmailAutocompleteInput
                        value={email}
                        onChange={setEmail}
                        placeholder="Start typing to search users..."
                        disabled={loading}
                        excludeEmails={existingEmails}
                    />
                    <button
                        onClick={handleSendRequest}
                        disabled={loading || !email.trim()}
                        className="bg-[var(--accent)] text-white px-4 py-2 rounded hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                </div>
            </div>

            {/* Friend Requests */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-6 shadow">
                <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
                    Friend Requests
                </h2>

                {requests.length === 0 && (
                    <p className="text-[var(--text-muted)]">No pending requests</p>
                )}

                <ul className="space-y-3">
                    {requests.map((r) => (
                        <li
                            key={r.id}
                            className="flex justify-between items-center border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 rounded text-[var(--text-primary)]"
                        >
                            <div>
                                <p className="font-medium">
                                    {r.firstname} {r.lastname}
                                </p>
                                <p className="text-sm text-[var(--text-muted)]">{r.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAccept(r.id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleReject(r.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Friends List */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-6 shadow">
                <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">Friends</h2>

                {friends.length === 0 && (
                    <p className="text-[var(--text-muted)]">No friends yet</p>
                )}

                <ul className="space-y-3">
                    {friends.map((f) => (
                        <li
                            key={f.id}
                            className="flex justify-between items-center border border-[var(--border-color)] bg-[var(--bg-elevated)] p-3 rounded text-[var(--text-primary)]"
                        >
                            <div>
                                <p className="font-medium">
                                    {f.firstname} {f.lastname}
                                </p>
                                <p className="text-sm text-[var(--text-muted)]">{f.email}</p>
                            </div>
                            <button
                                onClick={() => handleRemove(f.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
