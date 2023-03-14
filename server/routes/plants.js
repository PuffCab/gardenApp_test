import express from "express";
const router = express.Router();

router.get("/plants", (req, res) => {
  res.send({ msg: "Test route." });
});
export default router;
