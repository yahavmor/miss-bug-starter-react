export function UserPreview({ user }) {
    return (
        <article className="bug-preview">
            <p>Fullname: <span>{user.fullname}</span></p>
            <p>Username: <span>{user.username}</span></p>
            <p>ID: <span>{user._id}</span></p>
        </article>
    )
}