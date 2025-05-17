const mongoose = require("mongoose");
const { rule } = require("postcss");

const homeSchema = mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  photo: String,
  rules: String,
});

homeSchema.pre("findOneAndDelete", async function (next) {
  try {
    const query = this.getQuery(); // this refers to the query, not the document
    const homeId = query._id;

    if (!homeId) return next();

    const User = mongoose.model("User");

    await User.updateMany(
      { favorites: homeId },
      { $pull: { favorites: homeId } }
    );

    await User.updateMany(
      { reserves: homeId },
      { $pull: { reserves: homeId } }
    );

    await User.updateMany({ booked: homeId }, { $pull: { booked: homeId } });

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Home", homeSchema);
