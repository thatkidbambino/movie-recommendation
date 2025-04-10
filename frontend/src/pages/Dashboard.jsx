import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ token }) {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [tmdbId, setTmdbId] = useState("");
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMovies();
  }, [token]);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/movies`, {
        headers: { Authorization: token },
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
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/movies`,
        { title, tmdbId, rating },
        { headers: { Authorization: token } }
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
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/movies/${id}`, {
        headers: { Authorization: token },
      });
      setMovies(movies.filter((movie) => movie._id !== id));
    } catch (err) {
      setError("Failed to delete movie.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6">🎞️ MovieMate Dashboard</h2>

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
              key={movie._id}
              className="bg-gray-800 p-4 rounded flex justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold">{movie.title}</h3>
                <p>TMDB ID: {movie.tmdbId}</p>
                <p>Rating: ⭐ {movie.rating}/10</p>
              </div>
              <button
                onClick={() => handleDelete(movie._id)}
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
