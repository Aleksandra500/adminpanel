import { useEffect, useState } from "react";
import { getPrivateMessages, sendPrivateMessage } from "../services/privateMessageService";
import socket from "../socket";

export default function PrivateChat({ currentUser, targetUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const roomId = [currentUser, targetUser].sort().join("-");

    socket.emit("joinRoom", { currentUser, targetUser });

    const handleReceive = (msg) => {
      if (msg.roomId === roomId) {
        setMessages((prev) => {
          // proveravamo da li poruka već postoji u state-u
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("receivePrivateMessage", handleReceive);

    const fetchMessages = async () => {
      try {
        const data = await getPrivateMessages(roomId);
        setMessages(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();

    return () => {
      socket.off("receivePrivateMessage", handleReceive);
    };
  }, [currentUser, targetUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const roomId = [currentUser, targetUser].sort().join("-");

    const newMsg = {
      sender: currentUser,
      receiver: targetUser,
      text,
      roomId,
      id: Date.now(), // privremeni ID da bismo izbegli duplikate
    };

    // Dodajemo odmah u state
    setMessages((prev) => [...prev, newMsg]);
    setText("");

    try {
      await sendPrivateMessage(newMsg); // čuvanje na backendu
      socket.emit("sendPrivateMessage", newMsg); // emitujemo posle čuvanja
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-indigo-950 to-black p-2 sm:p-4 rounded-2xl shadow-lg text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold">
          💌 Chat with {targetUser}
        </h2>
        <button
          onClick={onClose}
          className="bg-white/6 hover:bg-white/10 px-2 py-1 text-sm sm:px-3 sm:py-1.5 rounded-full shadow"
        >
          Close
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-2 sm:mb-4 p-2 sm:p-3 bg-[#0f1724] rounded-2xl shadow-inner flex flex-col gap-2">
        {messages.length === 0 ? (
          <p className="text-white/60 text-center mt-2">Nema poruka 😄</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id || msg.timestamp}
              className={`p-3 max-w-[70%] rounded-2xl break-words shadow-sm ${
                msg.sender === currentUser
                  ? "ml-auto bg-gradient-to-br from-purple-600 to-indigo-500 text-white"
                  : "mr-auto bg-white/6 text-white"
              }`}
            >
              <div className="text-xs text-white/80 mb-1">{msg.sender}</div>
              <div className="text-sm leading-relaxed">{msg.text}</div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Unesi poruku..."
          className="flex-1 bg-white/6 rounded-full px-4 py-3 outline-none placeholder-white/50 text-white shadow-md"
        />
        <button
          type="submit"
          className="bg-gradient-to-br from-purple-600 to-indigo-500 px-5 py-2 rounded-full shadow-md text-white font-medium hover:opacity-90 transition"
        >
          Pošalji
        </button>
      </form>
    </div>
  );
}
