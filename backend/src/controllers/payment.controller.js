const paymentService = require("../services/payment.service");

const pay = async (req, res, next) => {
  try {
    const { payment, subscription } = await paymentService.pay(
      req.user._id,
      req.body
    );
    res.json({
      message: "Paiement réussi, abonnement activé",
      payment,
      subscription,
    });
  } catch (err) {
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const payments = await paymentService.listUserPayments(req.user._id);
    res.json({ payments });
  } catch (err) {
    next(err);
  }
};

module.exports = { pay, list };
