const { Link, NavLink, useNavigate } = ReactRouterDOM
import { authService } from "../services/auth.service.js"
export function AppHeader({ loggedinUser, setLoggedinUser }) {

    const navigate = useNavigate()
    function onLogout() {
    authService.logout()
    .then(() => {
    setLoggedinUser(null)
    })
    .catch(err => {
    console.log(err)
    showErrorMsg(`Couldn't logout`)
    })
    }

    function onBack() {
    navigate(-1)
    }

    return (
    <header className="app-header full main-layout">
    <section>
        <h1>Miss Bug</h1>

    <nav className="app-nav">
    <NavLink to="/" >Home</NavLink>
    <NavLink to="/about" >About</NavLink>
    <NavLink to="/bug" >Bugs</NavLink>
    {!loggedinUser
    ? <NavLink to="/auth" >Login</NavLink>
    : <div className="user">
    <Link to={`/user/${loggedinUser._id}`}>{loggedinUser.fullname}</Link>
    <button onClick={onLogout}>logout</button>
    </div>
    }
    </nav>
    </section>
    </header>
    )
}
