import React, { useEffect, useState, useRef } from "react";
import { getMessages, sendMessage } from "../services/messageService";
import { getAllUsers } from "../services/userService";

export default function ChatPage({ currentUser, onSelectUser }) {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [text, setText] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [m, u] = await Promise.all([getMessages(), getAllUsers()]);
        setMessages(m || []);
        setUsers(u || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchAll();
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
      console.error("Send error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/6">
        <div className="flex items-center gap-3">
          <button
            className="sm:hidden p-2 bg-white/5 rounded-md"
            onClick={() => setShowSidebar((s) => !s)}
            aria-label="Toggle users"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold">DarkChat</h1>
          <span className="text-sm text-white/60 ml-2">{currentUser}</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-white/6 px-3 py-1 rounded-md text-sm">New</button>
          <button
            onClick={() => {
              localStorage.removeItem("chatUser");
              window.location.reload();
            }}
            className="bg-rose-600 px-3 py-1 rounded-md text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${showSidebar ? "block" : "hidden"} sm:block w-full sm:w-72 bg-[#0f1724] border-r border-white/6 overflow-y-auto`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm text-white/80 font-medium">People</h2>
              <span className="text-xs text-white/50">{users.length} online</span>
            </div>

            <div className="flex flex-col gap-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectUser?.(u.username);
                    setShowSidebar(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md hover:bg-white/6 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center text-xs font-semibold">
                    {u.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium truncate">{u.username}</div>
                    <div className="text-xs text-white/60">online</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat column */}
        <section className="flex-1 flex flex-col">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-gradient-to-b from-black/0 to-white/2">
            {messages.length === 0 ? (
              <div className="mx-auto text-white/60 mt-20">Nema poruka još — budi prvi! ✨</div>
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
        </section>
      </main>
    </div>
  );
}
