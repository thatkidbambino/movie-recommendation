import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [tmdbId, setTmdbId] = useState("");
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      navigate("/login");
      return;
    }
    fetchMovies(savedToken);
  }, []);

  const fetchMovies = async (savedToken) => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:5000/api/movies", {
        headers: { Authorization: savedToken },
      });
      setMovies(res.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to load movies.");
      setIsLoading(false);
    }
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    const savedToken = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/movies",
        { title, tmdbId, rating },
        { headers: { Authorization: savedToken } }
      );
      setMovies([...movies, res.data]);
      setTitle("");
      setTmdbId("");
      setRating(0);
      setError("");
    } catch (err) {
      setError("Failed to add movie.");
    }
  };

  const handleDelete = async (id) => {
    const savedToken = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/movies/${id}`, {
        headers: { Authorization: savedToken },
      });
      setMovies(movies.filter((movie) => movie.id !== id));
    } catch (err) {
      setError("Failed to delete movie.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload(); // ensures clean reset
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">🎞️ MovieMate Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <form
        onSubmit={handleAddMovie}
        className="bg-gray-800 p-4 rounded mb-6 flex flex-col md:flex-row gap-4"
      >
        <input
          type="text"
          placeholder="Movie Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded text-black flex-1"
          required
        />
        <input
          type="text"
          placeholder="TMDB ID"
          value={tmdbId}
          onChange={(e) => setTmdbId(e.target.value)}
          className="p-2 rounded text-black flex-1"
          required
        />
        <input
          type="number"
          placeholder="Rating (1-10)"
          value={rating}
          min="1"
          max="10"
          onChange={(e) => setRating(Math.min(10, Math.max(1, e.target.value)))}
          className="p-2 rounded text-black w-24"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Movie
        </button>
      </form>

      {isLoading && <p>Loading your movies...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && movies.length === 0 && <p>No movies added yet.</p>}

      {!isLoading && movies.length > 0 && (
        <ul className="space-y-4">
          {movies.map((movie) => (
            <li
              key={movie.id}
              className="bg-gray-800 p-4 rounded flex justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold">{movie.title}</h3>
                <p>TMDB ID: {movie.tmdbId}</p>
                <p>Rating: ⭐ {movie.rating}/10</p>
              </div>
              <button
                onClick={() => handleDelete(movie.id)}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
