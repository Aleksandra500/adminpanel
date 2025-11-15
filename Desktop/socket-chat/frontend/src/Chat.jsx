import React, { useEffect, useState, useRef } from "react";
import { getMessages, sendMessage } from "./services/messageService";

export default function ChatPage({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(); // samo global chat poruke
        setMessages(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim()) return;

    const newMessage = { sender: currentUser, text };
    try {
      const saved = await sendMessage(newMessage);
      setMessages((prev) => [...prev, saved]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0f1724] rounded-xl p-4">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="mx-auto text-white/60 mt-20">
            Nema poruka još — budi prvi! ✨
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id || m.timestamp}
              className={`max-w-[72%] px-4 py-3 rounded-2xl break-words shadow-sm ${
                m.sender === currentUser
                  ? "ml-auto bg-gradient-to-br from-purple-600 to-indigo-500 text-white"
                  : "mr-auto bg-white/6 text-white"
              }`}
            >
              <div className="text-xs text-white/80 mb-1">{m.sender}</div>
              <div className="text-sm leading-relaxed">{m.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <form onSubmit={handleSend} className="border-t border-white/6 p-3 bg-[#071019]">
        <div className="max-w-4xl mx-auto flex gap-3 items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Pošalji poruku..."
            className="flex-1 bg-white/6 rounded-full px-4 py-3 outline-none placeholder-white/50"
          />
          <button
            type="submit"
            className="bg-gradient-to-br from-purple-600 to-indigo-500 px-5 py-2 rounded-full shadow-md"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
