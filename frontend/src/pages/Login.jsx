import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fillDemo = (role) => {
    if (role === "student") {
      setEmail("student@campuspass.com");
      setPassword("student123");
    } else {
      setEmail("organizer@campuspass.com");
      setPassword("organizer123");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "organizer" ? "/organizer/dashboard" : "/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border">
        <h1 className="text-2xl font-extrabold text-center mb-1">🎟️ CampusPass</h1>
        <p className="text-center text-gray-500 mb-6">Smart Event Registration & QR Attendance</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-full font-semibold hover:bg-primaryDark disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 border-t pt-4">
          <p className="text-xs text-gray-400 mb-2 text-center">Demo accounts (seeded via `npm run seed`)</p>
          <div className="flex gap-2">
            <button
              onClick={() => fillDemo("student")}
              className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg py-2"
            >
              🎓 Fill Student
            </button>
            <button
              onClick={() => fillDemo("organizer")}
              className="flex-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg py-2"
            >
              👑 Fill Organizer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
