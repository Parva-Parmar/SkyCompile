import ProfileSection from "./ProfileSection";
import ProjectsSection from "./ProjectsSection";
import FriendsSection from "./FriendsSection";

interface MainPanelProps {
    active: string;
}

export default function MainPanel({ active }: MainPanelProps) {
    return (
        <main className="flex-1 p-6 bg-[var(--bg-primary)]">
            {active === "profile" && <ProfileSection />}
            {active === "projects" && <ProjectsSection />}
            {active === "friends" && <FriendsSection />}
        </main>
    );
}
