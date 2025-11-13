const db = require('../db');

const MessageModel = {
  // GLOBALNI CHAT
  getAllMessages: (callback) => {
    const sql = "SELECT * FROM messages ORDER BY timestamp ASC";
    db.query(sql, callback);
  },

  addMessage: (sender, text, callback) => {
    const sql = "INSERT INTO messages (sender, text) VALUES (?, ?)";
    db.query(sql, [sender, text], callback);
  },

  // PRIVATNI CHAT
getPrivateMessages: (roomId, callback) => {
    const sql = "SELECT * FROM private_messages WHERE room_id = ? ORDER BY created_at ASC";
    db.query(sql, [roomId], callback);
  },

  addPrivateMessage: (roomId, sender, receiver, text, callback) => {
    const sql = "INSERT INTO private_messages (room_id, sender, receiver, text) VALUES (?, ?, ?, ?)";
    db.query(sql, [roomId, sender, receiver, text], callback);
  }
};

module.exports = MessageModel;
