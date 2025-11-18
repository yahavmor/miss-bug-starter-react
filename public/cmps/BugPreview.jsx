export function BugPreview({bug}) {
    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>Description: <span>{bug.description ? bug.description : 'very bad'}</span></p>
        <p>creator: <span>{bug.creator.fullname}</span></p>
    </article>
}