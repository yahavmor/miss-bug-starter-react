import { UserList } from '../cmps/UserList.JSX'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'
const { useState, useEffect } = React

export function UserIndex(){
    const [users, setUsers] = useState(null)

    useEffect(loadUsers, [])

    function loadUsers() {
        userService.query()
            .then(setUsers)  
            .catch(err => showErrorMsg(`Couldn't load users - ${err}`));
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                const usersToUpdate = users.filter(user => user._id !== userId)
                setUsers(usersToUpdate)
                showSuccessMsg('User removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove user - ${err}`))
    }

    return (
        <section className="user-index main-content">
            <header>
                <h3>User List</h3>
            </header>
            <UserList users={users} onRemoveUser={onRemoveUser} />
        </section>
    )
}




