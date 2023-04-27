const User = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const client = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN,
  {
    lazyLoading: true,
  }
);

exports.register = async (req, res, next) => {
  const {
    firstname,
    lastname,
    email,
    mobile,
    password,
    city,
    role,
    imageUrl,
    panCard,
    registration,
    profilePic,
  } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);

  let verified = false;
  try {
    if (role === "passenger") {
      verified = true;
    }

    const newUser = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      mobile: mobile,
      password: hashedPwd,
      city: city,
      role: role,
      license: {
        imageUrl,
      },
      panCard: panCard,
      registration: registration,
      profilePic: profilePic,
      verified: verified,
    });

    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      res.status(409).json({ msg: "Email already exists!" });
      return;
    }

    const token = jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const savedUser = await newUser.save();
    res.status(200).json({ savedUser, token });
  } catch (err) {
    console.log("register err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({ msg: "Incorrect email or password." });
      return;
    }

    const decryptedPw = await bcrypt.compare(password, user.password);
    if (!decryptedPw) {
      res.status(400).json({ msg: "Incorrect email or password." });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    console.log("login err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.sendOtp = async (req, res, next) => {
  const { countryCode, phoneNumber } = req.body;

  if (!countryCode || !phoneNumber) {
    return res.status(401).json({ msg: "Enter all Required fields" });
  }
  if (phoneNumber.length < 10) {
    return res.status(401).json({ msg: "Phone must be atleast 10 characters" });
  }

  try {
    const otpResponse = await client.verify.v2
      .services("VAc5765b2512a65da35cbf9e3e352d67e6")
      .verifications.create({
        to: `+${countryCode}${phoneNumber}`,
        channel: "sms",
      });

    res.status(201).json({ msg: "OTP send succesfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

exports.verifyMobileNumber = async (req, res, next) => {
  const { countryCode, phoneNumber, otp, password } = req.body;

  if (!countryCode || !phoneNumber || !otp || !account_type) {
    return res.status(401).json({ msg: "Enter all Required fields" });
  }
  if (phoneNumber.length < 10) {
    return res.status(401).json({ msg: "Phone must be atleast 10 characters" });
  }

  try {
    const user = await User.findOne({ mobile: phoneNumber });

    if (!user) {
      res.status(404).json({ msg: "Incorrect mobile or password." });
      return;
    }

    const decryptedPw = await bcrypt.compare(password, user.password);
    if (!decryptedPw) {
      res.status(400).json({ msg: "Incorrect mobile or password." });
      return;
    }

    const verificationResponse = await client.verify.v2
      .services("VAc5765b2512a65da35cbf9e3e352d67e6")
      .verificationChecks.create({
        to: `+${countryCode}${phoneNumber}`,
        code: otp,
      });

    if (verificationResponse.valid) {
      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      res.status(200).json({ user, token });
    }
  } catch (err) {
    console.log("verify mobile err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateProfile = async (req, res, next) => {
  const {
    firstname,
    lastname,
    profilePic,
    mobile,
    email,
    paymentMode,
    // rating,
    role,
  } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        firstname,
        lastname,
        profilePic,
        mobile,
        email,
        paymentMode,
        // rating,
        role,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("update profile err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getProfile = async (req, res, next) => {
  console.log(req.userId);
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ msg: "User not found!" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("get profile err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.changePassword = async (req, res, next) => {
  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      res.status(404).json({ msg: "User not found!" });
      return;
    }

    user.password = hashedPwd;
    await user.save();

    res.status(200).json({ msg: "Password updated!" });
  } catch (err) {
    console.log("passwodd update err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

// admin -----------
exports.adminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(404).json({ msg: "Incorrect email or password." });
      return;
    }

    const decryptedPw = await bcrypt.compare(password, user.password);
    if (!decryptedPw) {
      res.status(400).json({ msg: "Incorrect email or password." });
      return;
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ user, token });
  } catch (err) {
    console.log("admin login err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.adminRegister = async (req, res, next) => {
  const { firstname, lastname, email, password, profilePic, city, mobile } =
    req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);

  try {
    const newAdmin = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPwd,
      role: "admin",
      city: city,
      mobile: mobile,
      profilePic: profilePic,
    });

    const oldUser = await User.findOne({ email: email });
    if (oldUser) {
      res.status(409).json({ msg: "Email already exists!" });
      return;
    }

    const token = jwt.sign(
      {
        userId: newAdmin._id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const savedAdmin = await newAdmin.save();
    res.status(200).json({ savedAdmin, token });
  } catch (err) {
    console.log("admin register err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (err) {
    console.log("getting all users err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ msg: "User does not exist!" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("getting a user err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      res.status(404).json({ msg: "User does not exist!" });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "User deleted!" });
  } catch (err) {
    console.log("deleting user err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateUser = async (req, res, next) => {
  const {
    firstname,
    lastname,
    city,
    role,
    // license,
    // panCard,
    // registration,
    // profilePic,
    // verified,
  } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ msg: "User does not exist!" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        firstname,
        lastname,
        city,
        role,
        // verified,
      }
      // { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("updating user err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.verifyUser = async (req, res, next) => {
  const { expiryDate, userId } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ msg: "User does not exist!" });
      return;
    }

    // const verifiedUser = await User.updateOne(
    //   { _id: req.params.id },
    //   { $set: { license: { expiration: expiryDate }, verified: true } }
    // );
    const verifiedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        "license.expiration": expiryDate,
        // license: {
        //   expi
        // }
        // expiration: expiryDate,
        verified: true,
      },

      { new: true }
    );

    res.status(200).json({ msg: "Done!" });
  } catch (err) {
    console.log("verify user err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getUsersNum = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });

    const usersLength = await users?.length;

    res.status(200).json(usersLength);
  } catch (err) {
    console.log("get users num err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};
