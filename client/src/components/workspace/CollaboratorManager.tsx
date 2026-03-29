import { useState } from "react";
import { Users, Plus, Settings } from "lucide-react";
import CollaboratorModal from "./CollaboratorModal";
import CollaboratorList from "./CollaboratorList";

interface CollaboratorManagerProps {
  projectId: string;
  currentUserId: string;
}

export default function CollaboratorManager({ projectId, currentUserId }: CollaboratorManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "settings">("list");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCollaboratorAdded = () => {
    // Refresh the collaborator list
    setRefreshKey(prev => prev + 1);
  };

  const handleUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="h-full flex flex-col bg-[var(--sidebar-bg)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[var(--accent)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Collaborators</h2>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--border-color)]">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "list"
              ? "text-[var(--accent)] border-b-2 border-[var(--accent)] bg-[var(--panel-bg)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          Team Members
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "settings"
              ? "text-[var(--accent)] border-b-2 border-[var(--accent)] bg-[var(--panel-bg)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Settings
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "list" ? (
          <CollaboratorList
            key={refreshKey}
            projectId={projectId}
            currentUserId={currentUserId}
            onUpdate={handleUpdate}
          />
        ) : (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Collaboration Settings</h3>
            
            <div className="space-y-6">
              {/* Project Access */}
              <div>
                <h4 className="text-[var(--text-primary)] font-medium mb-3">Project Access</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-[var(--bg-elevated)] rounded-lg">
                    <div>
                      <p className="text-[var(--text-primary)]">Allow member invitations</p>
                      <p className="text-[var(--text-muted)] text-sm">Editors can invite new members</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-4 h-4 text-[var(--accent)] bg-[var(--bg-primary)] border-[var(--border-color)] rounded focus:ring-[var(--accent)]"
                    />
                  </label>
                  
                  <label className="flex items-center justify-between p-3 bg-[var(--bg-elevated)] rounded-lg">
                    <div>
                      <p className="text-[var(--text-primary)]">Require approval for new members</p>
                      <p className="text-[var(--text-muted)] text-sm">Owners must approve new collaborators</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      className="w-4 h-4 text-[var(--accent)] bg-[var(--bg-primary)] border-[var(--border-color)] rounded focus:ring-[var(--accent)]"
                    />
                  </label>
                </div>
              </div>

              {/* Real-time Collaboration */}
              <div>
                <h4 className="text-[var(--text-primary)] font-medium mb-3">Real-time Collaboration</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-[var(--bg-elevated)] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[var(--text-primary)]">Live cursor tracking</p>
                      <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded">Active</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm">See where other users are editing in real-time</p>
                  </div>
                  
                  <div className="p-3 bg-[var(--bg-elevated)] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[var(--text-primary)]">Live text synchronization</p>
                      <span className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded">Active</span>
                    </div>
                    <p className="text-[var(--text-muted)] text-sm">Changes appear instantly for all collaborators</p>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h4 className="text-[var(--text-primary)] font-medium mb-3">Permission Levels</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-[var(--text-muted)]">Owner - Full control and member management</span>
                  </div>
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-[var(--text-muted)]">Editor - Can edit files and invite members</span>
                  </div>
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-[var(--text-muted)]">Viewer - Read-only access with commenting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Collaborator Modal */}
      <CollaboratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        onCollaboratorAdded={handleCollaboratorAdded}
      />
    </div>
  );
}
