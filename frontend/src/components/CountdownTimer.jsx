import { useEffect, useState } from "react";

const getTimeLeft = (targetDate) => {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
};

// size: "sm" for card badges, "lg" for the event detail page
const CountdownTimer = ({ dateTime, size = "sm" }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(dateTime));

  useEffect(() => {
    const tick = setInterval(() => setTimeLeft(getTimeLeft(dateTime)), 1000);
    return () => clearInterval(tick);
  }, [dateTime]);

  if (!timeLeft) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-gray-200 text-gray-600 ${size === "lg" ? "px-4 py-1.5 text-sm" : "px-2 py-1 text-xs"}`}>
        🏁 Event Ended
      </span>
    );
  }

  if (size === "sm") {
    const label =
      timeLeft.days > 0
        ? `${timeLeft.days}d ${timeLeft.hours}h left`
        : timeLeft.hours > 0
        ? `${timeLeft.hours}h ${timeLeft.minutes}m left`
        : `${timeLeft.minutes}m ${timeLeft.seconds}s left`;

    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-accent/15 text-accentDark">
        ⏳ {label}
      </span>
    );
  }

  return (
    <div className="flex gap-3">
      {[
        { label: "Days", value: timeLeft.days },
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds }
      ].map((unit) => (
        <div key={unit.label} className="bg-ink text-white rounded-xl px-4 py-3 text-center min-w-[64px]">
          <div className="text-2xl font-display font-bold">{String(unit.value).padStart(2, "0")}</div>
          <div className="text-[10px] uppercase tracking-wide text-gray-400">{unit.label}</div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;