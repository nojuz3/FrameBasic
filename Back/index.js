const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./src/db.js");
const JWT_SECRET = process.env.JWT_SECRET || "JSW";
const corsOptions = {
  origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));
app.use(express.json());

// LOGIN REGISTER
app.post(`/register`, async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    //
    const existinguser = db
      .prepare("SELECT * FROM users WHERE  username = ? OR email = ?")
      .get(username, email);
    if (existinguser) {
      return res
        .status(400)
        .json({ success: false, message: "The email or username exists" });
    }
    //
    const hashedPassword = await bcrypt.hash(password, 10);
    //
    db.prepare(
      "INSERT INTO users (username,email ,password) VALUES (?, ?, ?)"
    ).run(username, email, hashedPassword);
    //
    res.json({ success: true, message: "User created!" });
    //
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});
app.post(`/login`, async (req, res) => {
  //
  const { username, password } = req.body;
  //
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  //
  const userExist = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);
  //
  if (!userExist) {
    return res.status(400).json({ message: "Invalid username or password." });
  }
  //
  try {
    //
    const passwordMatch = await bcrypt.compare(password, userExist.password);
    //
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    //
    const token = jwt.sign(
      { id: userExist.id, role: userExist.role },
      JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    //
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// AUTH MIDDLEWARE
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(403);
  }
};

app.get(`/me`, authenticateToken, async (req, res) => {
  try {
    const user = db
      .prepare("SELECT id, username, role FROM users WHERE id = ?")
      .get(req.user.id);

    if (!user) {
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/placeholder", authenticateToken, (req, res) => {
  const {
    title,
    description,
    date,
    location,
    ticketPrice,
    capacity,
    category,
    image,
  } = req.body;

  if (
    !title ||
    !description ||
    !date ||
    !location ||
    !ticketPrice ||
    !capacity ||
    !category ||
    !image
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }
  try {
    db.prepare(
      "INSERT INTO pending (title, description, date, location, ticketPrice, capacity, category, image, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      title,
      description,
      date,
      location,
      ticketPrice,
      capacity,
      category,
      image,
      req.user.id
    );

    res.json({ success: true, message: "Placeholder created!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.get("/placeholder/all", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied." });
  }
  try {
    const placeholders = db.prepare("SELECT * FROM pending").all();
    res.json({ success: true, placeholders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.post("/placeholder/confirm", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied." });
  }
  const {
    id,
    title,
    description,
    date,
    location,
    ticketPrice,
    capacity,
    category,
    image,
  } = req.body;
  try {
    db.prepare(
      "INSERT INTO festivals (title, description, date, location, ticketPrice, capacity, category, image, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(
      title,
      description,
      date,
      location,
      ticketPrice,
      capacity,
      category,
      image,
      req.user.id
    );
    db.prepare("DELETE FROM pending WHERE id = ?").run(id);
    res.json({ success: true, message: "Placeholder confirmed!" });
  } catch (error) {
    console.log(error);
  }
});
app.post("/placeholder/delete", authenticateToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied." });
  }

  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "ID is required." });
  }

  try {
    db.prepare("DELETE FROM pending WHERE id = ?").run(id);
    res.json({ success: true, message: "Placeholder deleted!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.get("/data",authenticateToken, (req, res) => {
  try {
    const festivals = db.prepare("SELECT * FROM festivals").all();
    res.json({ success: true, festivals });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.listen(8080, () => {
  console.log("Server started on port 8080");
});
