import { useEffect, useState } from "react";
import api from "../services/api";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/registrations/me")
      .then(({ data }) => setTickets(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center py-12 text-gray-500">Loading your tickets...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-6">🎫 My Tickets</h1>
      {tickets.length === 0 ? (
        <p className="text-gray-500">You haven't registered for any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((t) => (
            <div key={t._id} className="bg-white border rounded-2xl p-5 text-center shadow-sm">
              <h3 className="font-bold mb-1">{t.event?.title}</h3>
              <p className="text-xs text-gray-500 mb-3">
                {t.event ? new Date(t.event.dateTime).toLocaleString() : ""}
              </p>
              <img src={t.qrCode} alt="QR ticket" className="mx-auto w-40 h-40" />
              <p className="text-xs font-mono text-gray-400 mt-2">{t.ticketId}</p>
              <span
                className={`inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full ${
                  t.checkedIn ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}
              >
                {t.checkedIn ? "✅ Checked in" : "⏳ Not checked in yet"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
