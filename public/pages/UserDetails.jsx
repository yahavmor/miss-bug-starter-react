const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.remote.js"
import { userService } from "../services/user.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"

export function UserDetails() {
  const [user, setUser] = useState(null)
  const [userBugs, setUserBugs] = useState([])   
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
    loadBugs()
  }, [params.userId])

function loadBugs() {
  userService.getUserBugs(params.userId)
    .then(bugs => {
      console.log('Fetched bugs:', bugs)
      setUserBugs(bugs)
    })
    .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
}



  function loadUser() {
    userService.getById(params.userId)
      .then(setUser)
      .catch(err => {
        console.log('err:', err)
        navigate('/')
      })
  }

  function onBack() {
    navigate('/bug')
  }

  if (!user) return <div>Loading...</div>
  return (
    <section className="user-details">
      <h1>User {user.fullname}</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit...</p>
      <BugList bugs={userBugs} />

      <button onClick={onBack}>Back</button>
    </section>
  )
}
