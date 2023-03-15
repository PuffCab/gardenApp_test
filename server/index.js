import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import mongoose from "mongoose";
import plantsRoutes from "./routes/plantsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { cloudinaryConfig } from "./config/cloudinary.js";
import jwtStrategy from "./config/passport.js";

const app = express();
const port = process.env.PORT || 5003;

const mongoDBConnection = async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connection to Mongo DB established on port" + port);
  } catch (error) {
    console.log("error conection to MONGODB", error);
  }
};

const loadRoutes = () => {
  // app.use("/api", router);
  app.use("/api/plants", plantsRoutes);
  app.use("/api/users", userRoutes);
};

const startServer = () => {
  app.listen(port, () => {
    console.log("Server is running on " + port + "port");
  });
};

const addMiddlewares = () => {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  const corsOptions = {
    origin: "*",
    credentials: true,
  };
  app.use(cors(corsOptions));
  // app.use(cors());
  cloudinaryConfig();
  app.use(passport.initialize());
  passport.use(jwtStrategy);
};

async function controller() {
  await mongoDBConnection();
  addMiddlewares();
  loadRoutes();
  startServer();
}
controller();
export default app;
