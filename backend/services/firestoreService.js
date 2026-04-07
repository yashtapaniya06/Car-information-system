const { db, admin } = require('../firebase');

class FirestoreService {

  // ================= CARS =================

  async getCars() {
    const snapshot = await db.collection('cars').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getCarById(id) {
    const doc = await db.collection('cars').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  }

  async addCar(data) {
    const newCar = {
      ...data,
      featured: data.featured || false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('cars').add(newCar);
    return { id: docRef.id, ...newCar };
  }

  async updateCar(id, data) {
    await db.collection('cars').doc(id).update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  }

  async deleteCar(id) {
    await db.collection('cars').doc(id).delete();
    return { success: true };
  }

  async getFeatured() {
    const snapshot = await db.collection('cars')
      .where('featured', '==', true)
      .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async checkModel(model) {
    const snapshot = await db.collection('cars')
      .where('model', '==', model)
      .get();

    return { exists: !snapshot.empty };
  }

  // ================= USERS =================

  async getUsers() {
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async deleteUser(id) {
    await db.collection('users').doc(id).delete();
    return { success: true };
  }

  // ================= CONTACTS =================

  async getContacts() {
    const snapshot = await db.collection('contacts').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addContact(data) {
    const newContact = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('contacts').add(newContact);
    return { id: docRef.id, ...newContact };
  }

  // ================= RATINGS =================

  async getRatings() {
    const snapshot = await db.collection('ratings').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addRating(data) {
    const newRating = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('ratings').add(newRating);
    return { id: docRef.id, ...newRating };
  }
}

module.exports = FirestoreService;
