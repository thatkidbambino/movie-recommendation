import { LogOut } from "lucide-react";

export default function Navbar({ onLogout }) {
  return (
    <nav className="flex justify-between items-center bg-gray-800 p-4 shadow-md">
      <h1 className="text-2xl font-bold text-primary">🎬 MovieMate</h1>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
      >
        <LogOut size={18} />
        Logout
      </button>
    </nav>
  );
}
