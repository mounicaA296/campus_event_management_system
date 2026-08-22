import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import CountdownTimer from "../components/CountdownTimer";

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState("");
  const [ticket, setTicket] = useState(null);
  const [registering, setRegistering] = useState(false);

  const load = async () => {
    const { data } = await api.get(`/events/${id}`);
    setEvent(data);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRegister = async () => {
    if (!user) return navigate("/login");
    if (user.role !== "student") {
      setMessage("Only students can register for events.");
      return;
    }
    setRegistering(true);
    setMessage("");
    try {
      const { data } = await api.post(`/registrations/${id}`);
      setTicket(data.qrCode);
      setMessage("✅ Registered! Your QR ticket is below — also saved under 'My Tickets'.");
      load();
    } catch (err) {
      setMessage(err?.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  if (!event) return <p className="text-center py-12 text-gray-500">Loading event...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <img
        src={event.image || "https://picsum.photos/seed/" + event._id + "/800/300"}
        className="w-full h-64 object-cover rounded-2xl mb-6"
        alt={event.title}
      />
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">{event.category}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${event.status === "upcoming" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
          {event.status}
        </span>
      </div>
            <h1 className="text-3xl font-display font-extrabold mb-3">{event.title}</h1>
      <p className="text-gray-600 mb-4">{event.description}</p>

      {event.status === "upcoming" && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Starts in</p>
          <CountdownTimer dateTime={event.dateTime} size="lg" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <div className="bg-gray-50 rounded-xl p-4">📍 <strong>Venue:</strong> {event.venue}</div>
        <div className="bg-gray-50 rounded-xl p-4">🗓️ <strong>Date:</strong> {new Date(event.dateTime).toLocaleString()}</div>
        <div className="bg-gray-50 rounded-xl p-4">🏷️ <strong>Organizer:</strong> {event.organizer?.name}</div>
        <div className="bg-gray-50 rounded-xl p-4">🎫 <strong>Seats left:</strong> {event.seatsLeft} / {event.registrationLimit}</div>
      </div>

      {event.status === "upcoming" && (
        <button
          onClick={handleRegister}
          disabled={registering || event.seatsLeft === 0}
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primaryDark disabled:opacity-50"
        >
          {event.seatsLeft === 0 ? "Event Full" : registering ? "Registering..." : "Register & Get QR Ticket"}
        </button>
      )}

      {message && <p className="mt-4 text-sm">{message}</p>}

      {ticket && (
        <div className="mt-6 bg-white border rounded-2xl p-6 text-center max-w-xs">
          <p className="font-semibold mb-3">Your Ticket QR</p>
          <img src={ticket} alt="QR ticket" className="mx-auto" />
          <p className="text-xs text-gray-400 mt-3">Show this at the venue to check in</p>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
