const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    dishes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish"
      }
    ] //dish다큐먼트 내부의 서브 다큐먼트
  },
  {
    timestamps: true
  }
);

var Favorites = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorites;
