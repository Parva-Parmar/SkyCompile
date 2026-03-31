import { useState } from "react";
import { Users, X } from "lucide-react";
import CollaboratorManager from "./CollaboratorManager";

interface CollaboratorButtonProps {
  projectId: string;
  currentUserId: string;
}

export default function CollaboratorButton({ projectId, currentUserId }: CollaboratorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Users className="w-4 h-4" />}
        {isOpen ? "Close" : "Team"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg w-full max-w-4xl h-96 mx-4 shadow-xl text-[var(--text-primary)]">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Collaborators</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-80">
              <CollaboratorManager projectId={projectId} currentUserId={currentUserId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
