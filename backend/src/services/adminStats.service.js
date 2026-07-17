const User = require("../models/user.model");
const Content = require("../models/content.model");
const Series = require("../models/series.model");
const UserSubscription = require("../models/userSubscription.model");
const Payment = require("../models/payment.model");
const ContactMessage = require("../models/contactMessage.model");

// Agrège les indicateurs du dashboard admin en une seule réponse.
const getStats = async () => {
  const [
    usersCount,
    filmsCount,
    seriesCount,
    activeSubscribers,
    revenueResult,
    revenueByPlanRaw,
    recentUsers,
    recentMessages,
    recentPayments,
  ] = await Promise.all([
    User.countDocuments(),
    Content.countDocuments(),
    Series.countDocuments(),
    UserSubscription.countDocuments({ isActive: true }),
    Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: "$subscriptionPlan",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "subscriptionplans",
          localField: "_id",
          foreignField: "_id",
          as: "plan",
        },
      },
      { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          planName: { $ifNull: ["$plan.name", "Inconnu"] },
          total: 1,
          count: 1,
        },
      },
      { $sort: { total: -1 } },
    ]),
    User.find()
      .sort({ _id: -1 })
      .limit(5)
      .select("firstName lastName email createdAt"),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5),
    Payment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("subscriptionPlan", "name"),
  ]);

  return {
    counts: {
      users: usersCount,
      films: filmsCount,
      series: seriesCount,
      activeSubscribers,
    },
    revenue: {
      total: revenueResult.length > 0 ? revenueResult[0].total : 0,
      byPlan: revenueByPlanRaw,
    },
    recent: {
      users: recentUsers,
      messages: recentMessages,
      payments: recentPayments,
    },
  };
};

module.exports = { getStats };
