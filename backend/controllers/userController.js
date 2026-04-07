const { db } = require("../firebase");

// ================= GET ALL USERS (ADMIN) =================
exports.getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ================= GET USER COUNT =================
exports.getUserCount = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    res.status(200).json({ totalUsers: snapshot.size });
  } catch (error) {
    console.error('Get user count error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ================= DELETE USER =================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("users").doc(id).delete();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: error.message });
  }
};
