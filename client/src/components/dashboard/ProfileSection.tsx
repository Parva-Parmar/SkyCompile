import { useEffect, useState } from "react";
import { getAuthRequest } from "../../api/http";

interface Profile {
    firstname?: string;
    lastname?: string;
    name: string;
    email: string;
    project_count: number;
    friend_count: number;
}

export default function ProfileSection() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getAuthRequest("/users/me");
                console.log("Profile data received:", data);
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <p className="text-gray-500">Loading profile...</p>;
    }

    if (!profile) {
        return <p className="text-red-500">Could not load profile</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>

            <div className="space-y-2 text-gray-700">
                <p><strong>First Name:</strong> {profile.firstname || 'Not set'}</p>
                <p><strong>Last Name:</strong> {profile.lastname || 'Not set'}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Projects:</strong> {profile.project_count}</p>
                <p><strong>Friends:</strong> {profile.friend_count}</p>
            </div>

            <button className="mt-6 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600">
                Change Password
            </button>
        </div>
    );
}
