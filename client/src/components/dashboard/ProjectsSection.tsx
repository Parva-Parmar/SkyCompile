import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD
import {
    getProjects,
    createProject,
    deleteProject,
} from "../../api/projects";
import type { Project } from "../../api/projects";

import ProjectCards from "./ProjectCards";

export default function ProjectsSection() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [newProject, setNewProject] = useState("");
    const navigate = useNavigate(); // ✅ ADD

    const loadProjects = async () => {
        const data = await getProjects();
        setProjects(data);
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleCreate = async () => {
        if (!newProject.trim()) return;
        await createProject(newProject);
        setNewProject("");
        loadProjects();
    };

    const handleDelete = async (id: string) => {
        await deleteProject(id);
        loadProjects();
    };

    // ✅ NEW: open workspace
    const handleOpenProject = (id: string) => {
        navigate(`/projects/${id}`);
    };

    return (
        <div className="space-y-6">
            {/* Create Project */}
            <div className="flex gap-3">
                <input
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    placeholder="New project name"
                    className="flex-1 border rounded px-3 py-2"
                />
                <button
                    onClick={handleCreate}
                    className="bg-indigo-500 text-white px-4 py-2 rounded"
                >
                    Add Project
                </button>
            </div>

            {/* Project List */}
            <ProjectCards
                projects={projects}
                onDelete={handleDelete}
                onOpen={handleOpenProject} // ✅ PASS THIS
            />
        </div>
    );
}
