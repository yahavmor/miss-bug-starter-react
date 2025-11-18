const { Link } = ReactRouterDOM
import { BugPreview } from './BugPreview.jsx'

export function BugList({ bugs, onRemoveBug, onEditBug, loggedinUser }) {

    if (!bugs) return <div>Loading...</div>

    return (
        <ul className="bug-list">
            {bugs.map(bug => (
                <li key={bug._id}>
                    <BugPreview bug={bug} />

                    {(loggedinUser && (
                        loggedinUser.isAdmin || (bug.creator && loggedinUser._id === bug.creator._id)
                    )) && (
                        <section className="actions">
                            <Link to={`/bug/${bug._id}`}>
                                <button>Details</button>
                            </Link>
                            <button onClick={() => onEditBug(bug)}>Edit</button>
                            <button onClick={() => onRemoveBug(bug._id)}>x</button>
                        </section>
                    )}
                </li>
            ))}
        </ul>
    )
}
