const FirestoreService = require('../services/firestoreService');
const dbService = new FirestoreService();

// ================= GET ALL CARS =================
exports.getCars = async (req, res) => {
  try {
    const data = await dbService.getCars();
    // Frontend expects a plain array of cars
    res.status(200).json(data);
  } catch (error) {
    console.error("Get Cars Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= GET CAR BY ID =================
exports.getCarById = async (req, res) => {
  try {
    const car = await dbService.getCarById(req.params.id);

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Frontend expects a single car object
    res.status(200).json(car);

  } catch (error) {
    console.error("Get Car By ID Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= ADD CAR (ADMIN) =================
exports.addCar = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Car data is required"
      });
    }

    const newCar = await dbService.addCar(req.body);

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      data: newCar
    });

  } catch (error) {
    console.error("Add Car Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================= UPDATE CAR (ADMIN) =================
exports.updateCar = async (req, res) => {
  try {
    const updated = await dbService.updateCar(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Car updated successfully",
      data: updated
    });

  } catch (error) {
    console.error("Update Car Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================= DELETE CAR (ADMIN) =================
exports.deleteCar = async (req, res) => {
  try {
    await dbService.deleteCar(req.params.id);

    res.status(200).json({
      success: true,
      message: "Car deleted successfully"
    });

  } catch (error) {
    console.error("Delete Car Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ================= FEATURED CARS =================
exports.getFeatured = async (req, res) => {
  try {
    let data = await dbService.getFeatured();

    // If no explicit featured cars, fall back to first few cars
    if (!data || data.length === 0) {
      const allCars = await dbService.getCars();
      data = allCars.slice(0, 3);
    }

    // Frontend expects a plain array
    res.status(200).json(data);

  } catch (error) {
    console.error("Featured Cars Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= CHECK MODEL =================
exports.checkModel = async (req, res) => {
  try {
    const result = await dbService.checkModel(req.params.model);

    res.status(200).json(result);

  } catch (error) {
    console.error("Check Model Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================= CAR COUNT =================
exports.getCarCount = async (req, res) => {
  try {
    const { db } = require('../firebase');
    const snapshot = await db.collection('cars').get();

    res.status(200).json({
      totalCars: snapshot.size
    });

  } catch (error) {
    console.error("Car Count Error:", error);
    res.status(500).json({ error: error.message });
  }
};