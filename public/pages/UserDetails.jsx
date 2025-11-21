const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { BugList } from "../cmps/BugList.jsx"
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

    <div className="user-card">
      <h2>User Info</h2>
      <div className="user-field"><span>ID:</span> {user._id}</div>
      <div className="user-field"><span>Username:</span> {user.username}</div>
      <div className="user-field"><span>Full Name:</span> {user.fullname}</div>
    </div>

  <p>
  Welcome to Miss Bug — a simple and efficient way to track, review, and manage software issues. 
  Here you can browse all open bugs, report new ones, and follow updates from your team in real time. 
  Stay organized, stay productive, and keep your projects running smoothly.
  </p>
    <BugList bugs={userBugs} />

    <button onClick={onBack}>Back</button>
  </section>
)

}
