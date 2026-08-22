import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border rounded-2xl p-5 text-center">
    <div className="text-3xl mb-1">{icon}</div>
    <div className="text-2xl font-extrabold">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

const OrganizerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    api.get("/dashboard/stats").then(({ data }) => setStats(data));
    api.get("/events/mine/list").then(({ data }) => setMyEvents(data));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold">📊 Organizer Dashboard</h1>
        <Link to="/organizer/create-event" className="bg-primary text-white px-5 py-2 rounded-full hover:bg-primaryDark">
          + Create Event
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Events" value={stats.totalEvents} icon="🗓️" />
          <StatCard label="Total Registrations" value={stats.totalRegistrations} icon="🎫" />
          <StatCard label="Checked In" value={stats.totalCheckedIn} icon="✅" />
          <StatCard label="Attendance %" value={`${stats.overallAttendancePercent}%`} icon="📈" />
        </div>
      )}

      {stats?.todaysEvent && (
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-5 mb-8">
          <p className="font-semibold mb-1">🎯 Today's Event: {stats.todaysEvent.title}</p>
          <p className="text-sm text-gray-600">
            Checked In {stats.todaysEvent.checkedIn} / {stats.todaysEvent.registered} · {stats.todaysEvent.attendancePercent}% attendance
          </p>
        </div>
      )}

      <h2 className="text-xl font-bold mb-3">My Events</h2>
      <div className="overflow-x-auto bg-white border rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Event</th>
              <th className="p-3">Date</th>
              <th className="p-3">Registered</th>
              <th className="p-3">Checked In</th>
            </tr>
          </thead>
          <tbody>
            {myEvents.map((e) => (
              <tr key={e._id} className="border-t">
                <td className="p-3 font-medium">{e.title}</td>
                <td className="p-3">{new Date(e.dateTime).toLocaleString()}</td>
                <td className="p-3">{e.registeredCount}</td>
                <td className="p-3">{e.checkedInCount}</td>
              </tr>
            ))}
            {myEvents.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-400">No events created yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
