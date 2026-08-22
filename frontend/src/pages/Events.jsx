import { useEffect, useState } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== "all") params.category = category;
      if (status !== "all") params.status = status;
      const { data } = await api.get("/events", { params });
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, status]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-fest-gradient rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-display font-extrabold mb-2">Discover Campus Events</h1>
          <p className="opacity-90">Register in seconds. Get a QR ticket. Walk in and scan.</p>
        </div>
        <div className="absolute -right-6 -bottom-8 text-[120px] opacity-20 rotate-12 select-none">🎫</div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchEvents()}
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-lg px-4 py-2">
          <option value="all">All Categories</option>
          <option value="Technical">Technical</option>
          <option value="Cultural">Cultural</option>
          <option value="Workshop">Workshop</option>
          <option value="Sports">Sports</option>
          <option value="Other">Other</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-lg px-4 py-2">
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
        <button onClick={fetchEvents} className="bg-primary text-white rounded-lg px-5 py-2 hover:bg-primaryDark">
          Search
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e) => (
            <EventCard key={e._id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
