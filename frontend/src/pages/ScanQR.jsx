import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../services/api";

// The demo "wow" screen: scan a student's QR ticket, get instant feedback,
// and if the same ticket is scanned twice, show "Already Checked In".
const ScanQR = () => {
  const scannerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [manualTicket, setManualTicket] = useState("");
  const [scanning, setScanning] = useState(false);

  const handleTicket = async (ticketId) => {
    try {
      const { data } = await api.post("/attendance/scan", { ticketId });
      setResult({ ok: true, ...data });
    } catch (err) {
      setResult({ ok: false, ...(err?.response?.data || { message: "Scan failed" }) });
    }
  };

  const startScanner = async () => {
    setScanning(true);
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;
    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
          await handleTicket(decodedText);
          await html5QrCode.stop();
          setScanning(false);
        }
      );
    } catch (err) {
      console.error("Camera error:", err);
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (e) {}
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) scannerRef.current.stop().catch(() => {});
    };
  }, []);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualTicket.trim()) handleTicket(manualTicket.trim());
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold mb-2">📷 Scan QR — Attendance Check-in</h1>
      <p className="text-gray-500 mb-6 text-sm">
        Scan a student's ticket QR with the camera, or paste the ticket ID manually (useful if you don't have a webcam handy for the demo).
      </p>

      <div id="qr-reader" className="w-full rounded-xl overflow-hidden mb-4"></div>

      {!scanning ? (
        <button onClick={startScanner} className="bg-primary text-white px-5 py-2.5 rounded-full font-semibold hover:bg-primaryDark mb-6">
          Start Camera Scanner
        </button>
      ) : (
        <button onClick={stopScanner} className="bg-gray-200 px-5 py-2.5 rounded-full font-semibold mb-6">
          Stop Scanner
        </button>
      )}

      <form onSubmit={handleManualSubmit} className="flex gap-2 mb-6">
        <input
          value={manualTicket}
          onChange={(e) => setManualTicket(e.target.value)}
          placeholder="Or paste ticket ID e.g. CP-9F3A2C1B"
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg">Check</button>
      </form>

      {result && (
        <div
          className={`rounded-2xl p-5 border ${
            result.status === "success"
              ? "bg-green-50 border-green-300"
              : result.status === "duplicate"
              ? "bg-amber-50 border-amber-300"
              : "bg-red-50 border-red-300"
          }`}
        >
          <p className="font-bold text-lg mb-1">{result.message}</p>
          {result.student && <p className="text-sm">Student: {result.student}</p>}
          {result.email && <p className="text-sm">Email: {result.email}</p>}
          {result.event && <p className="text-sm">Event: {result.event}</p>}
          {result.checkedInAt && (
            <p className="text-sm">Time: {new Date(result.checkedInAt).toLocaleTimeString()}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScanQR;
