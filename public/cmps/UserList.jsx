import { UserPreview } from "./UserPreview.jsx"

export function UserList({ users, onRemoveUser}) {
    if (!users) return <div>Loading...</div>
    return (
        <ul className="bug-list">
            {users.map(user => (
                <li key={user._id}>
                    <UserPreview user={user} />
                    <section className="actions">
                        <button onClick={() => onRemoveUser(user._id)}>Remove</button>
                    </section>
                </li>
            ))}
        </ul>
    )
}