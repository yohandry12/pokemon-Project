const mongoose = require("mongoose");
const SubscriptionPlan = require("../src/models/ABONNEMENT/abonnement");

const plans = [
  {
    name: "Basique",
    description: "Accès limité, 1 appareil, qualité 720p, pubs incluses.",
    price: 4.99,
    currency: "EUR",
    duration: 30,
    features: {
      maxDevices: 1,
      maxQuality: "720p",
      downloadAllowed: false,
      adsEnabled: true,
    },
    isActive: true,
  },
  {
    name: "Standard",
    description: "Accès illimité, 2 appareils, 1080p, sans pubs.",
    price: 8.99,
    currency: "EUR",
    duration: 30,
    features: {
      maxDevices: 2,
      maxQuality: "1080p",
      downloadAllowed: true,
      adsEnabled: false,
    },
    isActive: true,
  },
  {
    name: "Premium",
    description: "Tout illimité, 4 appareils, 4K, téléchargements, sans pubs.",
    price: 14.99,
    currency: "EUR",
    duration: 30,
    features: {
      maxDevices: 4,
      maxQuality: "4K",
      downloadAllowed: true,
      adsEnabled: false,
    },
    isActive: true,
  },
];

async function seed() {
  await mongoose.connect("mongodb://localhost:27017/bd_handflix", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const count = await SubscriptionPlan.countDocuments();
  if (count === 0) {
    await SubscriptionPlan.insertMany(plans);
    console.log("Plans d'abonnement insérés !");
  } else {
    console.log("Des plans existent déjà, rien à faire.");
  }
  await mongoose.disconnect();
}

seed(); 