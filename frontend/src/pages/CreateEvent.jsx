import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Technical",
    venue: "",
    dateTime: "",
    registrationLimit: 100,
    image: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/events", form);
      navigate("/organizer/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">➕ Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl border">
        <input name="title" placeholder="Event Name" value={form.title} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="3" className="w-full border rounded-lg px-4 py-2" />
        <div className="grid grid-cols-2 gap-4">
          <select name="category" value={form.category} onChange={handleChange} className="border rounded-lg px-4 py-2">
            <option>Technical</option>
            <option>Cultural</option>
            <option>Workshop</option>
            <option>Sports</option>
            <option>Other</option>
          </select>
          <input name="venue" placeholder="Venue" value={form.venue} onChange={handleChange} required className="border rounded-lg px-4 py-2" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="datetime-local" name="dateTime" value={form.dateTime} onChange={handleChange} required className="border rounded-lg px-4 py-2" />
          <input type="number" name="registrationLimit" placeholder="Registration Limit" value={form.registrationLimit} onChange={handleChange} className="border rounded-lg px-4 py-2" />
        </div>
        <input name="image" placeholder="Image URL (optional)" value={form.image} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={loading} className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primaryDark disabled:opacity-60">
          {loading ? "Publishing..." : "Publish Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
