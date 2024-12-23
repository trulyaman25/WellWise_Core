import { NavLink } from "react-router-dom";

function Header() {
    return (
        <>
            <NavLink to='/'>Home</NavLink>
            <NavLink to='/register'>Register</NavLink>
            <NavLink to='/login'>Login</NavLink>
            <NavLink to='/patient'>Patient Dashboard</NavLink>
            <NavLink to='/doctor'>Doctor Dashboard</NavLink>
            <NavLink to='/dispensary'>Dispensary Dashboard</NavLink>
        </>
    );
}

export default Header;