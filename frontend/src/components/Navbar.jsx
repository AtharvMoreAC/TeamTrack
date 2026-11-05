import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("name");

        navigate("/login");
    };

    return (
        <nav className="navbar">

            {/* Logo */}
            <div className="navbar-logo">
                <Link to="/">TeamTrack</Link>
            </div>

            {/* Navigation Links */}
            <div className="navbar-links">

                <Link to="/">Home</Link>

                {token && (
                    <>
                        {/* Guide Navigation */}
                        {role === "guide" && (
                            <>
                                <Link to="/guide-dashboard">
                                    Dashboard
                                </Link>

                                <Link to="/teams">
                                    Teams
                                </Link>

                                <Link to="/tasks">
                                    Tasks
                                </Link>
                            </>
                        )}

                        {/* Member Navigation */}
                        {role === "member" && (
                            <>
                                <Link to="/member-dashboard">
                                    Dashboard
                                </Link>

                                <Link to="/member-tasks">
                                    My Tasks
                                </Link>
                            </>
                        )}
                    </>
                )}

                {/* Public Navigation */}
                <Link to="/about">About</Link>

                <Link to="/contact">Contact</Link>

                {/* Login / Logout */}
                {!token ? (
                    <>
                        <Link to="/login">Login</Link>

                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>
                )}

            </div>
        </nav>
    );
}

export default Navbar;
