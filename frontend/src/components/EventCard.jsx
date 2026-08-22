import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";

const categoryColors = {
  Technical: "bg-blue-100 text-blue-700",
  Cultural: "bg-pink-100 text-pink-700",
  Workshop: "bg-amber-100 text-amber-700",
  Sports: "bg-green-100 text-green-700",
  Other: "bg-gray-100 text-gray-700"
};

const EventCard = ({ event }) => {
  const dateStr = new Date(event.dateTime).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const pctFilled = event.registrationLimit
    ? Math.round((event.registeredCount / event.registrationLimit) * 100)
    : 0;
  const fillingFast = event.status === "upcoming" && event.seatsLeft > 0 && pctFilled >= 80;

  return (
    <div className="bg-white rounded-2xl shadow-sm border hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
      <div className="relative">
        <img
          src={event.image || "https://picsum.photos/seed/" + event._id + "/500/220"}
          alt={event.title}
          className="h-40 w-full object-cover"
        />
        {event.status === "upcoming" && (
          <div className="absolute top-2 right-2">
            <CountdownTimer dateTime={event.dateTime} size="sm" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[event.category] || categoryColors.Other}`}>
            {event.category}
          </span>
          {fillingFast ? (
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-600 animate-pulse">
              🔥 Filling Fast
            </span>
          ) : (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${event.status === "upcoming" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
              {event.status}
            </span>
          )}
        </div>
        <h3 className="font-display font-bold text-lg mb-1">{event.title}</h3>
        <p className="text-sm text-gray-500 mb-1">📍 {event.venue}</p>
        <p className="text-sm text-gray-500 mb-3">🗓️ {dateStr}</p>

        <div className="mb-3">
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${fillingFast ? "bg-red-500" : "bg-primary"}`}
              style={{ width: `${Math.min(pctFilled, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {event.registeredCount}/{event.registrationLimit} registered · {event.seatsLeft} seats left
          </p>
        </div>

        <Link
          to={`/events/${event._id}`}
          className="mt-auto text-center bg-primary text-white py-2 rounded-full font-medium hover:bg-primaryDark transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;