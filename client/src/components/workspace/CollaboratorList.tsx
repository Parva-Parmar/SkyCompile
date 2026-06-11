import { useState, useEffect } from "react";
import { Users, Crown, Edit, Eye, UserMinus } from "lucide-react";
import { getProjectMembers, removeProjectMember } from "../../api/projects";
import type { ProjectMember, ProjectRole } from "../../api/projects";

interface CollaboratorListProps {
  projectId: string;
  currentUserId: string;
  onUpdate?: () => void;
}

const getRoleIcon = (role: ProjectRole) => {
  switch (role) {
    case "OWNER":
      return <Crown className="w-4 h-4 text-yellow-400" />;
    case "EDITOR":
      return <Edit className="w-4 h-4 text-blue-400" />;
    case "VIEWER":
      return <Eye className="w-4 h-4 text-green-400" />;
    default:
      return <Users className="w-4 h-4 text-[var(--text-muted)]" />;
  }
};

const getRoleColor = (role: ProjectRole) => {
  switch (role) {
    case "OWNER":
      return "text-yellow-400 bg-yellow-900/20 border-yellow-700";
    case "EDITOR":
      return "text-blue-400 bg-blue-900/20 border-blue-700";
    case "VIEWER":
      return "text-green-400 bg-green-900/20 border-green-700";
    default:
      return "text-[var(--text-muted)] bg-[var(--bg-secondary)] border-[var(--border-color)]";
  }
};

const getRoleDescription = (role: ProjectRole) => {
  switch (role) {
    case "OWNER":
      return "Full control and permissions";
    case "EDITOR":
      return "Can edit and add members";
    case "VIEWER":
      return "Can view and comment";
    default:
      return "Unknown role";
  }
};

export default function CollaboratorList({ projectId, currentUserId, onUpdate }: CollaboratorListProps) {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const membersList = await getProjectMembers(projectId);
      setMembers(membersList);
    } catch (err: any) {
      setError(err.message || "Failed to load collaborators");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the project?`)) {
      return;
    }

    try {
      setActionLoading(memberId);
      await removeProjectMember(projectId, memberId);
      await loadMembers();
      onUpdate?.();
    } catch (err: any) {
      alert(err.message || "Failed to remove collaborator");
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [projectId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-900 border border-red-700 rounded-lg">
          <p className="text-red-200">{error}</p>
          <button
            onClick={loadMembers}
            className="mt-2 text-red-300 hover:text-red-100 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="p-6 text-center">
        <Users className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
        <p className="text-[var(--text-muted)]">No collaborators yet</p>
        <p className="text-[var(--text-muted)] text-sm mt-2">Add team members to start collaborating</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Collaborators ({members.length})
        </h3>
      </div>

      <div className="space-y-3">
        {members.map((member) => {
          const isCurrentUser = member.user.id === currentUserId;
          const canRemove = !isCurrentUser && member.role !== "OWNER";

          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-color)] hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center">
                  <span className="text-[var(--text-primary)] font-medium">
                    {member.user.firstname.charAt(0)}
                    {member.user.lastname.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[var(--text-primary)] font-medium">
                      {member.user.firstname} {member.user.lastname}
                    </p>
                    {isCurrentUser && (
                      <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-2 py-1 rounded">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--text-muted)] text-sm">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getRoleIcon(member.role)}
                  <div>
                    <span className={`text-xs font-medium px-2 py-1 rounded border ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                    <p className="text-[var(--text-muted)] text-xs mt-1">
                      {getRoleDescription(member.role)}
                    </p>
                  </div>
                </div>

                {canRemove && (
                  <div className="relative">
                    <button
                      onClick={() => handleRemoveMember(member.user.id, `${member.user.firstname} ${member.user.lastname}`)}
                      disabled={actionLoading === member.user.id}
                      className="p-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors disabled:opacity-50"
                      title="Remove collaborator"
                    >
                      {actionLoading === member.user.id ? (
                        <div className="w-4 h-4 animate-spin rounded-full border border-red-400 border-t-transparent"></div>
                      ) : (
                        <UserMinus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
        <p className="text-[var(--text-muted)] text-xs">
          <strong>Roles:</strong> Owners can manage all aspects, Editors can edit and add members, Viewers can only view and comment.
        </p>
      </div>
    </div>
  );
}
