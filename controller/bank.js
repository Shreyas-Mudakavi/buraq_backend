const Bank = require("../models/Bank");

exports.addBank = async (req, res, next) => {
  const { firstname, lastname, accountNum, branchName, post_code, city, dob } =
    req.body;

  try {
    const newBank = new Bank({
      userId: req.userId,
      firstname: firstname,
      lastname: lastname,
      accountNum: accountNum,
      branchName: branchName,
      post_code: post_code,
      city: city,
      dob: dob,
    });

    const alreadyExists = await Bank.findOne({ accountNum: accountNum });
    if (alreadyExists) {
      res.status(409).json({ msg: "Bank already exists!" });
      return;
    }

    const savedBank = await newBank.save();

    res.status(200).json(savedBank);
  } catch (err) {
    console.log("add bank err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getBank = async (req, res, next) => {
  try {
    const bank = await Bank.find({ userId: { $eq: req.userId } });

    if (!bank) {
      res.status(404).json({ msg: "No bank found!" });
      return;
    }

    res.status(200).json(bank);
  } catch (err) {
    console.log("get bank err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};
