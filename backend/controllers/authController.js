const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { db } = require("../firebase");

const SECRET_KEY = process.env.JWT_SECRET;

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if user already exists
    const existing = await db.collection("users")
      .where("email", "==", email)
      .get();

    if (!existing.empty) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      role: role || "user",
      createdAt: new Date()
    };

    const docRef = await db.collection("users").add(newUser);

    res.status(201).json({
      message: "User registered successfully",
      id: docRef.id,
      email: newUser.email,
      role: newUser.role
    });

  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
};


// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const snapshot = await db.collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const userDoc = snapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() };

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

// ================= CHECK AUTH STATUS =================
exports.checkAuth = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        isLoggedIn: false,
        userId: null,
        userName: null,
        role: null
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.json({
        isLoggedIn: false,
        userId: null,
        userName: null,
        role: null
      });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      
      // Get user from database
      const userDoc = await db.collection("users").doc(decoded.id).get();
      
      if (!userDoc.exists) {
        return res.json({
          isLoggedIn: false,
          userId: null,
          userName: null,
          role: null
        });
      }

      const userData = userDoc.data();

      res.json({
        isLoggedIn: true,
        userId: decoded.id,
        userName: userData.email || userData.userName || '',
        role: decoded.role || userData.role
      });

    } catch (tokenError) {
      return res.json({
        isLoggedIn: false,
        userId: null,
        userName: null,
        role: null
      });
    }

  } catch (err) {
    console.error('Check auth error:', err);
    res.json({
      isLoggedIn: false,
      userId: null,
      userName: null,
      role: null
    });
  }
};

// ================= CHECK ADMIN STATUS =================
exports.checkAdmin = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ isadmin: false });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.json({ isadmin: false });
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const isAdmin = decoded.role === "admin";
      
      res.json({ isadmin: isAdmin });

    } catch (tokenError) {
      return res.json({ isadmin: false });
    }

  } catch (err) {
    console.error('Check admin error:', err);
    res.json({ isadmin: false });
  }
};

// ================= LOGOUT =================
exports.logout = async (req, res) => {
  // Since we're using JWT tokens stored client-side, logout is mainly client-side
  // But we can provide a success response
  res.json({ message: "Logged out successfully" });
};
