const db = require('../db');

const addUser = (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: "Username is required" });
  }


  const checkQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkQuery, [username], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error", error: err });

    if (results.length > 0) {

      return res.json({ success: true, message: "Login successful!" });
    }

  
    const insertQuery = "INSERT INTO users (username) VALUES (?)";
    db.query(insertQuery, [username], (err2, results2) => {
      if (err2) return res.status(500).json({ success: false, message: "Database error on insert", error: err2 });

      return res.json({ success: true, message: "User created and login successful!" });
    });
  });
};

module.exports = { addUser };
