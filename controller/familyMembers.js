const FamilyMembersModel = require("../models/FamilyMembersModel");

exports.addFamilyMember = async (req, res, next) => {
  const { name, mobile, age } = req.body;

  try {
    const newFamilyMember = new FamilyMembersModel({
      user: req.userId,
      name,
      mobile,
      age,
    });

    const savedFamilyMember = await newFamilyMember.save();

    res.status(200).json(savedFamilyMember);
  } catch (err) {
    console.log("add family memb err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getFamilyMembers = async (req, res, next) => {
  try {
    const familyMembers = await FamilyMembersModel.find({ user: req.userId });

    if (!familyMembers) {
      res.status(404).json({ msg: "No family members added!" });
      return;
    }

    res.status(200).json(familyMembers);
  } catch (err) {
    console.log("get family membs err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.getFamilyMember = async (req, res, next) => {
  try {
    const familyMember = await FamilyMembersModel.findById(req.params.id);

    if (!familyMember) {
      res.status(404).json({ msg: "No family member!" });
      return;
    }

    res.status(200).json(familyMember);
  } catch (err) {
    console.log("get family memb err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.updateFamilyMember = async (req, res, next) => {
  const { name, age, mobile } = req.body;

  try {
    if (mobile?.length < 10) {
      return res
        .status(401)
        .json({ msg: "Phone must be atleast 10 characters" });
    }

    const familyMember = await FamilyMembersModel.findByIdAndUpdate(
      req.params.id,
      { name, age, mobile },
      { $new: true, runValidators: true }
    );

    res.status(200).json(familyMember);
  } catch (err) {
    console.log("update family memb err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};

exports.deleteFamilyMember = async (req, res, next) => {
  try {
    const familyMember = await FamilyMembersModel.findOne({
      _id: req.params.id,
    });

    if (!familyMember) {
      res.status(404).json({ msg: "No family member found!" });
      return;
    }

    await FamilyMembersModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Family member deleted!" });
  } catch (err) {
    console.log("update family memb err ", err);
    res.status(500).json({ err, msg: "Error from server!" });
  }
};
