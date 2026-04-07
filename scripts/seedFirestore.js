require('dotenv').config();
const { initFirebase } = require('../backend/firebase');
const path = require('path');

async function seed() {
  try {
    initFirebase();
    const admin = require('firebase-admin');
    const db = admin.firestore();

    const dataFolder = path.join(__dirname, '..', 'backend', 'DataBase', 'Collections');
    const cars = require(path.join(dataFolder, 'test.cars.json'));
    const users = require(path.join(dataFolder, 'test.users.json'));
    const contacts = require(path.join(dataFolder, 'test.contacts.json'));
    const ratings = require(path.join(dataFolder, 'test.ratings.json'));

    console.log('Seeding cars...');
    for (const c of cars) {
      const id = c.id ? String(c.id) : undefined;
      if (id) await db.collection('cars').doc(id).set(c); else await db.collection('cars').add(c);
    }

    console.log('Seeding users...');
    for (const u of users) {
      const id = u.id ? String(u.id) : undefined;
      if (id) await db.collection('users').doc(id).set(u); else await db.collection('users').add(u);
    }

    console.log('Seeding contacts...');
    for (const ct of contacts) await db.collection('contacts').add(ct);

    console.log('Seeding ratings...');
    for (const r of ratings) await db.collection('ratings').add(r);

    console.log('Seeding complete');
    process.exit(0);
  } catch (e) {
    console.error('Seed failed', e);
    process.exit(1);
  }
}

seed();
