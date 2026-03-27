import { useState } from "react";
import { X, Users, Shield } from "lucide-react";
import { addProjectMember } from "../../api/projects";
import type { ProjectMember, ProjectRole } from "../../api/projects";
import { getFriends } from "../../api/friends";
import type { Friend } from "../../api/friends";
import EmailAutocompleteInput from "./EmailAutocompleteInput";

interface CollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onCollaboratorAdded: (member: ProjectMember) => void;
}

export default function CollaboratorModal({
  isOpen,
  onClose,
  projectId,
  onCollaboratorAdded,
}: CollaboratorModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<ProjectRole>("EDITOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  const loadFriends = async () => {
    try {
      setLoadingFriends(true);
      const friendsList = await getFriends();
      setFriends(friendsList);
    } catch (err) {
      console.error("Failed to load friends:", err);
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const member = await addProjectMember(projectId, email.trim(), role);
      onCollaboratorAdded(member);
      setEmail("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add collaborator");
    } finally {
      setLoading(false);
    }
  };

  const handleFriendSelect = (friendEmail: string, friendRole: ProjectRole) => {
    setEmail(friendEmail);
    setRole(friendRole);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Add Collaborator</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <EmailAutocompleteInput
                value={email}
                onChange={setEmail}
                placeholder="Start typing to search users..."
                disabled={loading}
                excludeEmails={[]} // Add existing project members here if needed
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>
              <div className="space-y-2">
                {[
                  { value: "VIEWER", label: "Viewer", desc: "Can view and comment" },
                  { value: "EDITOR", label: "Editor", desc: "Can edit and add members" },
                  { value: "OWNER", label: "Owner", desc: "Full control and permissions" },
                ].map(({ value, label, desc }) => (
                  <label
                    key={value}
                    className="flex items-center p-3 bg-gray-700 border rounded-lg cursor-pointer transition-colors hover:bg-gray-600"
                  >
                    <input
                      type="radio"
                      value={value}
                      checked={role === value}
                      onChange={(e) => setRole(e.target.value as ProjectRole)}
                      className="mr-3 text-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{label}</span>
                        <Shield className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-gray-400 text-sm">{desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Friends Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Quick Add from Friends
                </label>
                <button
                  type="button"
                  onClick={loadFriends}
                  disabled={loadingFriends}
                  className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                >
                  {loadingFriends ? "Loading..." : "Load Friends"}
                </button>
              </div>
              
              {friends.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {friends.map((friend) => (
                    <button
                      key={friend.id}
                      type="button"
                      onClick={() => handleFriendSelect(friend.email, "EDITOR")}
                      className="w-full text-left p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                    >
                      <div className="text-white text-sm">
                        {friend.firstname} {friend.lastname}
                      </div>
                      <div className="text-gray-400 text-xs">{friend.email}</div>
                    </button>
                  ))}
                </div>
              )}
              
              {friends.length === 0 && !loadingFriends && (
                <div className="text-gray-400 text-sm">No friends available</div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900 border border-red-700 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add Collaborator"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
