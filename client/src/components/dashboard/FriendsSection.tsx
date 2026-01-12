const friends = [
    { name: "Aditya Dave", email: "aditya@test.com" },
    { name: "Ravi Kumar", email: "ravi@test.com" },
];

export default function FriendsSection() {
    return (
        <div className="bg-white p-6 rounded shadow max-w-3xl">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Friends</h2>
                <button className="bg-indigo-500 text-white px-4 py-2 rounded">
                    + Add Friend
                </button>
            </div>

            <ul className="space-y-4">
                {friends.map((friend, i) => (
                    <li key={i} className="flex justify-between items-center">
                        <div>
                            <p className="font-medium">{friend.name}</p>
                            <p className="text-sm text-gray-500">{friend.email}</p>
                        </div>

                        <button className="text-sm text-red-500 hover:underline">
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
