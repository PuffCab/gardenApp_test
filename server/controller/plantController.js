import plantModel from "../model/plantModel.js";

const getAllPlants = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const allPlants = await plantModel.find({});
    console.log("allPlants :>> ", allPlants);
    res.status(200).json({
      number: allPlants.length,
      allPlants,
    });
  } catch (error) {
    res.status(500).json({
      error,
      msg: "something went wrong",
    });
  }
};

const getPlantById = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const { id } = req.params;
    const plantById = await plantModel.find({ _id: req.params._id });
    console.log("plantById :>> ", plantById);
    if (!plantById) {
      res.status(404).json({
        msg: "Plant not found",
      });
    }
    res.status(200).json({
      number: plantById.length,
      plantById,
    });
  } catch (error) {
    res.status(500).json({
      error,
      msg: "something went wrong",
    });
  }
};

const postPlant = async (req, res) => {
  console.log("req.user", req.user);
  console.log("create plant", req.body);
  console.log("req.body", req.body.name);

  try {
    const { name, description, germinating_season, harvest, image } = req.body;
    console.log("req.body", req.body);

    const existingPlant = await plantModel.findOne({ name: req.body.name });
    console.log("existingPlant :>> ", existingPlant);
    console.log("req.user", req.user);

    if (existingPlant) {
      res.status(409).json({
        msg: "ups, this plant already exists",
      });
    } else {
      const newPlant = new plantModel({
        userName: req.user.userName, // req.body or req.user?
        name: req.body.name,
        description: req.body.description,
        germinating_season: req.body.germinating_season,
        harvest: req.body.harvest,
        image: req.body.image,
        userEmail: req.user.email,
      });
      console.log("newPlant", newPlant);
      try {
        const savedPlant = await newPlant.save();
        res.status(201).json({
          msg: "yay, you uploaded a plant",
          plant: {
            userName: savedPlant.userName,
            name: savedPlant.name,
            description: savedPlant.description,
            germinating_season: savedPlant.germinating_season,
            harvest: savedPlant.harvest,
            image: savedPlant.image,
          },
        });
      } catch (error) {
        console.log(error);
        console.log("error during posting");
        res.status(500).json({
          msg: "error during posting",
          error: error,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ msg: "error in general", error: error });
  }
};

const deletePlant = async (req, res) => {
  // console.log("req.user", req.user);
  //check here that req.user.email === selectedPlant.userEmail
  const { _id } = req.body;

  try {
    const selectedPlant = await plantModel.findOne({ _id: _id });

    if (!selectedPlant) {
      return res.status(404).json({ msg: "Plant not found" });
    }

    // if (selectedPlant.userEmail !== req.user.email) {
    //   return res.status(401).json({ msg: "Unauthorized" });
    // }

    await plantModel.findOneAndDelete({ _id: _id });

    res.status(200).json({ msg: "Plant deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error during delete", error });
  }
};

const postComment = async (req, res) => {
  // console.log("req.user:", req.user);
  const plantID = req.params._id;
  try {
    const commentToSubmit = {
      ...req.body,
      author: String(req.user.userName),
      authorPicture: String(req.user.userPicture),
    };
    const plant = await plantModel.findOneAndUpdate(
      { _id: plantID },
      {
        $push: { comments: commentToSubmit },
      },
      { new: true }
    );
    console.log("plantID", plantID);
    if (!plant) {
      return res.status(404).json({ error: "ID not found." });
    }
    return res.status(200).json({ msg: "comment submitted", plant });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { _id } = req.params;
    const { commentId } = req.body;
    const plant = await plantModel.findByIdAndUpdate(
      _id,
      { $pull: { comments: { _id: commentId } } },
      { returnOriginal: false }
    );

    console.log("commentId :>> ", commentId);
    console.log("_id", _id);

    console.log(req.body);

    if (!plant) {
      return res.status(404).json({
        msg: "Comment not found",
      });
    } else
      res.status(200).json({
        msg: "Comment deleted successfully",
        // plant,
      });
  } catch (error) {
    res.status(500).json({
      msg: "Something went wrong",
      error: error,
    });
  }
};

//add favourites
const addFavourite = async (req, res) => {
  try {
    const userId = req.user._id;
    const plant = await plantModel.findOne({
      _id: req.body.plantId,
    });

    if (plant.favs.includes(userId)) {
      return res.status(400).json({ message: "This plant is already in favs" });
    }

    const updatedUser = await plantModel.findOneAndUpdate(
      { _id: req.body.plantId },
      { $push: { favs: userId } },
      { new: true }
    );

    return res.status(200).json({ msg: "Plant added to favs" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ msg: "Error adding plant to favs", error: error });
  }
};

export {
  getAllPlants,
  getPlantById,
  postPlant,
  deletePlant,
  postComment,
  deleteComment,
  addFavourite,
};
