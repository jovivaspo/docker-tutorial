const { Router } = require("express");
const Animal = require("../models/Animal");

const router = Router();

router.get("/", async (req, res) => {
  console.log("Welcome to the app!!!");
  const animales = await Animal.find();
  return res.send(animales);
});

router.get("/crear", async (req, res) => {
  console.log("Creando Animal");
  await Animal.create({ type: "Cat", state: "Happy" });
  return res.send("Creando animal...");
});

module.exports = router;
