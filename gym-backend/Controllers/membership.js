const Membership = require("../Modals/membership");

exports.addMembership = async (req, res) => {
  try {
    const { months, price } = req.body;
    const membership = await Membership.findOne({ gym: req.gym._id, months });
    if (membership) {
      membership.price = price;
      await membership.save();
      res.status(200).json({
        message: "updated successfully",
      });
    } else {
      const newMembership = new Membership({ price, months, gym: req.gym._id });
      await newMembership.save();
      res.status(200).json({
        message: "added successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "server error",
    });
  }
};

exports.getMembership = async (req, res) => {
  try {
    const loggedInId = req.gym._id;
    const memberShip = await Membership.find({ gym: loggedInId });
    res.status(200).json({
      message: "membership fetched successfully",
      membership: memberShip,
    });
  } catch (error) {
    res.status(500).json({
      error: "server error",
    });
  }
};
