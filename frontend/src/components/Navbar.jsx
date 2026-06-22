import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center">
      <Link
        to="/dashboard"
        className="text-2xl font-bold"
      >
        🎬 MovieLens
      </Link>

      <div className="flex gap-6 items-center">
        <Link to="/dashboard">
          Home
        </Link>

        <Link to="/recommendations">
          Recommendations
        </Link>

        <Link to="/analytics">
          Analytics
        </Link>

        <Link to="/ratings">
          My Ratings
        </Link>

        <button
          onClick={logout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}