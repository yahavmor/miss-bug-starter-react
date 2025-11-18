// import { bugService } from '../services/bug.service.local.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug.service.remote.js'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'
import { utilService } from '../services/util.service.js'


export function BugIndex({ loggedinUser, setLoggedinUser }) {
    const { useState, useEffect , useRef} = React
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [lastPage , setLastPage] = useState(null)

    const debounced = useRef(utilService.debounce(onSetFilterBy, 200)).current
     
    useEffect(loadBugs, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(({ slicedBugs, totalPages }) => {
                setBugs(slicedBugs);
                setLastPage(totalPages - 1)
            })
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`));
    }


    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onAddBug() {
        if(!loggedinUser) return alert('Please login or sign-up to add bugs')
        const bug  = bugService.getBugfromUser(loggedinUser)
        bugService.save(bug)
            .then(savedBug => {
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onEditBug(bug) {
        const title = prompt('New title?', bug.title)
        const severity = +prompt('New severity?', bug.severity)
        const description = prompt('New description?', bug.description)
        const bugToSave = { ...bug, severity, title, description }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    return <section className="bug-index main-content">
        
        <BugFilter filterBy={filterBy} onSetFilterBy={debounced} lastPage={lastPage} />
        <header>
            <h3>Bug List</h3>
            <button onClick={onAddBug}>Add Bug</button>
        </header>
        
        <BugList 
            bugs={bugs} 
            onRemoveBug={onRemoveBug} 
            onEditBug={onEditBug}
            loggedinUser={loggedinUser}
            setLoggedinUser={setLoggedinUser} />
    </section>
}
