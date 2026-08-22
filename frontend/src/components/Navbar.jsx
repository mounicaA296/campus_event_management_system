import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-ink text-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-display font-extrabold flex items-center gap-2">
          <span className="bg-fest-gradient bg-clip-text text-transparent">🎟️ CampusPass</span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="text-gray-300 hover:text-accent transition-colors">Events</Link>

          {user?.role === "student" && (
            <Link to="/my-tickets" className="text-gray-300 hover:text-accent transition-colors">My Tickets</Link>
          )}

          {user?.role === "organizer" && (
            <>
              <Link to="/organizer/dashboard" className="text-gray-300 hover:text-accent transition-colors">Dashboard</Link>
              <Link to="/organizer/create-event" className="text-gray-300 hover:text-accent transition-colors">Create Event</Link>
              <Link to="/organizer/scan" className="text-gray-300 hover:text-accent transition-colors">Scan QR</Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-400">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-accent text-ink font-semibold px-4 py-1.5 rounded-full hover:bg-accentDark hover:text-white transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
 </nav>
  );
};

export default Navbar;