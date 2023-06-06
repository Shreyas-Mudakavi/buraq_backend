const RatingModel = require("../models/RatingModel");
const ReviewModel = require("../models/ReviewModel");
const User = require("../models/Users");

exports.addReview = async (req, res, next) => {
  const { driver, comment, rating, compliment } = req.body;

  try {
    if (rating <= 0) {
      return res
        .status(401)
        .json({ msg: "Rating value should be more than zero." });
    }

    const currDriver = await User.findById(driver);
    if (!currDriver) {
      return res.status(404).json({ msg: "Driver not found." });
    }

    const currUser = await User.findById(req.userId);
    if (!currUser) {
      return res.status(404).json({ msg: "User not found." });
    }

    const num = await ReviewModel.count({ driver });

    if (num === 0) {
      const newRating = new RatingModel({
        driver,
        rating: rating.toFixed(1),
      });

      await newRating.save();
    } else {
      const updateRating = await RatingModel.findOne({ driver: driver });

      const updatedRating = await ((updateRating.rating + rating) / (num + 1));

      updateRating.rating = updatedRating.toFixed(1);

      await updateRating.save();
    }

    const newReview = new ReviewModel({
      user: req.userId,
      driver,
      rating,
      compliment,
      comment,
    });

    const savedReview = await newReview.save();

    res.status(200).json(savedReview);
  } catch (err) {
    console.log("add review err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getReview = async (req, res, next) => {
  const driver = req.userId;

  try {
    const currDriver = await User.findById(req.userId);
    if (!currDriver) {
      return res.status(404).json({ msg: "Driver not found." });
    }

    const review = await ReviewModel.find({ driver: driver });

    const rating = await RatingModel.findOne({ driver: req.userId });

    res.status(200).json({ review, rating });
  } catch (err) {
    console.log("get reviews err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};
