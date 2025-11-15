import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import PrivateChat from "./PrivateChat";
import ChatPage from "../Chat";
import { getAllUsers } from "../services/userService";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [privateRoom, setPrivateRoom] = useState(null);
  const [users, setUsers] = useState([]);
  const [showGlobalChat, setShowGlobalChat] = useState(false);

  // Učitavanje trenutno prijavljenog korisnika
  useEffect(() => {
    const savedUser = localStorage.getItem("chatUser");
    setUser(savedUser || null);
  }, []);

  // Učitavanje liste korisnika
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("chatUser");
    setUser(null);
    setPrivateRoom(null);
    setShowGlobalChat(false);
  };

  if (!user) return <LoginPage onLogin={(username) => setUser(username)} />;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white">
      {/* Sidebar sa korisnicima i global chat dugmetom */}
      <aside className="w-72 bg-[#0f1724] border-r border-white/6 p-4 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold mb-2">Users</h2>
          {users
            .filter((u) => u.username !== user) // ne prikazuj sebe
            .map((u) => (
              <button
                key={u.id}
                onClick={() => {
                  setPrivateRoom({ targetUser: u.username });
                  setShowGlobalChat(false);
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

        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => {
              setShowGlobalChat(true);
              setPrivateRoom(null);
            }}
            className="bg-white/6 hover:bg-white/10 text-white px-3 py-2 rounded-full shadow-md"
          >
            🌐 Global Chat
          </button>
          <button
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-full shadow-md"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Glavni prikaz: privatni chat ili global chat */}
      <main className="flex-1 flex flex-col overflow-hidden p-4">
        {privateRoom ? (
          <PrivateChat
            currentUser={user}
            targetUser={privateRoom.targetUser}
            onClose={() => {
              setPrivateRoom(null);
              setShowGlobalChat(true); // vraća na global chat
            }}
          />
        ) : showGlobalChat ? (
          <ChatPage currentUser={user} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/60">
            Izaberi korisnika ili Global Chat
          </div>
        )}
      </main>
    </div>
  );
}
