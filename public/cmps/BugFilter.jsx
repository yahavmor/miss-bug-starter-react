const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy , lastPage}) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)    
    const [pageNumber, setPageNumber] = useState(filterBy.page || 0);

    
    useEffect(() => {
        onSetFilterBy({ ...filterByToEdit, page: pageNumber })
    }, [filterByToEdit, pageNumber])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        if (target.multiple) {
            value = Array.from(target.selectedOptions).map(opt => opt.value)
        } else {
            switch (target.type) {
                case 'number':
                case 'range':
                    value = +value || ''
                    break
                case 'checkbox':
                    value = target.checked
                    break
            }
        }

        setFilterByToEdit(prev => ({ ...prev, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }
    
    function goToNextPage() {
        setPageNumber(prev => prev + 1);
    }

    function goToPrevPage() {
        setPageNumber(prev => (prev > 0 ? prev - 1 : 0));
    }


    const { txt, minSeverity, sortBy, sortDir, label } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>🔍 Bug Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <div>
                    <label htmlFor="txt">Text</label>
                    <input value={txt} onChange={handleChange} type="text" id="txt" name="txt" placeholder="Search by text" />
                </div>

                <div>
                    <label htmlFor="minSeverity">Min Severity</label>
                    <input value={minSeverity} onChange={handleChange} type="number" id="minSeverity" name="minSeverity" placeholder="Minimum severity" />
                </div>

                <div>
                    <label htmlFor="label">Label</label>
                    <select name="label" id="label" value={label} onChange={handleChange}>
                        <option value="">All</option>
                        <option value="critical">Critical</option>
                        <option value="need-CR">Need CR</option>
                        <option value="dev-branch">Dev Branch</option>
                        <option value="network">Network</option>
                        <option value="bugfix">Bugfix</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="sortBy">Sort By</label>
                    <select name="sortBy" id="sortBy" value={sortBy} onChange={handleChange}>
                        <option value="">None</option>
                        <option value="title">Title</option>
                        <option value="severity">Severity</option>
                        <option value="createdAt">Created At</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="sortDir">Direction</label>
                    <select name="sortDir" id="sortDir" value={sortDir} onChange={handleChange}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
                
                <div className="pagination">
                    <button
                        type="button"
                        onClick={goToPrevPage}
                        disabled={pageNumber === 0}
                        className="pagination-btn"
                    >
                        ⬅ Previous
                    </button>

                    <span className="page-number">Page {pageNumber + 1}</span>

                    
                <button
                        type="button"
                        onClick={goToNextPage}
                        className="pagination-btn"
                        disabled={pageNumber === lastPage}
                    >
                        Next ➡
                </button>

                </div>

            </form>
        </section>
    )
}

