import express from "express";
import Amenity from "../models/Amenity.js";

const router = express.Router();

// Get all amenities
router.get("/", async (req, res) => {
  try {
    const amenities = await Amenity.findAll();
    res.status(200).json(amenities);
  } catch (error) {
    console.error("Error fetching amenities:", error);
    res.status(500).json({ error: "Failed to fetch amenities" });
  }
});

// Get amenity by ID
router.get("/:id", async (req, res) => {
  try {
    const amenity = await Amenity.findByPk(req.params.id);
    if (!amenity) {
      return res.status(404).json({ error: "Amenity not found" });
    }
    res.status(200).json(amenity);
  } catch (error) {
    console.error("Error fetching amenity:", error);
    res.status(500).json({ error: "Failed to fetch amenity" });
  }
});

// Get amenities by category
router.get("/category/:category", async (req, res) => {
  try {
    const amenities = await Amenity.findAll({
      where: { category: req.params.category },
    });
    res.status(200).json(amenities);
  } catch (error) {
    console.error("Error fetching amenities by category:", error);
    res.status(500).json({ error: "Failed to fetch amenities by category" });
  }
});

// Create a new amenity
router.post("/", async (req, res) => {
  try {
    const newAmenity = await Amenity.create(req.body);
    res.status(201).json(newAmenity);
  } catch (error) {
    console.error("Error creating amenity:", error);
    res.status(500).json({ error: "Failed to create amenity" });
  }
});

// Update an amenity
router.put("/:id", async (req, res) => {
  try {
    const [updated] = await Amenity.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedAmenity = await Amenity.findByPk(req.params.id);
      return res.status(200).json(updatedAmenity);
    }
    return res.status(404).json({ error: "Amenity not found" });
  } catch (error) {
    console.error("Error updating amenity:", error);
    res.status(500).json({ error: "Failed to update amenity" });
  }
});

// Delete an amenity
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Amenity.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      return res.status(204).send();
    }
    return res.status(404).json({ error: "Amenity not found" });
  } catch (error) {
    console.error("Error deleting amenity:", error);
    res.status(500).json({ error: "Failed to delete amenity" });
  }
});

export default router;
