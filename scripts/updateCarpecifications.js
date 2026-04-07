const admin = require('firebase-admin');
const serviceAccount = require('../backend/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project.firebaseio.com' // Update with your project
});

const db = admin.firestore();

const carSpecifications = {
  'hyundai creta': {
    fuelType: 'Diesel',
    transmission: 'Automatic',
    mileage: '16.8',
    engineCapacity: '1582',
    seatingCapacity: 5,
    bodyType: 'SUV',
    bootSpace: 472,
    features: 'Cruise Control, Touch Screen Infotainment, Apple CarPlay',
    safetyFeatures: 'ABS, Air Bags, Stability Control',
    warranty: '5 years / 1,00,000 km'
  },
  // Add more cars here
};

async function updateCars() {
  try {
    const snapshot = await db.collection('cars').get();
    
    let updated = 0;
    for (const doc of snapshot.docs) {
      const carData = doc.data();
      const modelKey = carData.model ? carData.model.toLowerCase() : null;
      
      if (modelKey && carSpecifications[modelKey]) {
        await doc.ref.update(carSpecifications[modelKey]);
        updated++;
        console.log(`✓ Updated: ${carData.brand} ${carData.model}`);
      }
    }
    
    console.log(`\n✅ Updated ${updated} car(s)`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating cars:', error);
    process.exit(1);
  }
}

updateCars();
