import express from "express";
import { getPlantById } from "../controller/plantController.js";

const router = express.Router();

router.get("/id", getPlantById);

export default router;
