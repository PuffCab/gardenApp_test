import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },

  authorPicture: {
    type: String,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },
});

const plantSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: false,
  },
  userEmail: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    unique: false,
  },
  germinating_season: {
    type: String,
    required: false,
    unique: false,
  },
  harvest: {
    type: String,
    required: false,
    unique: false,
  },
  image: {
    type: String,
    required: true,
    unique: false,
  },
  comments: [commentSchema],
  favs: [
    {
      type: String,
    },
  ],
});
const plantModel = mongoose.model("plant", plantSchema);
export default plantModel;
