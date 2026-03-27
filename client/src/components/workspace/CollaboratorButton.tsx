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
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Users className="w-4 h-4" />}
        {isOpen ? "Close" : "Team"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg w-full max-w-4xl h-96 mx-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Collaborators</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
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
