const Content = require("../../src/models/MODÈLE CONTENU/films");
const auth = require("../../src/auth/authAdmin");
const Actor = require("../../src/models/MODÈLE ACTEUR/acteur");

module.exports = (app) => {
  app.put("/api/contents/:contentId", auth, async (req, res) => {
    const { contentId } = req.params;

    // S'assurer que 'cast' est toujours un tableau
    const castData = Array.isArray(req.body.cast) ? req.body.cast : [];
    const { cast, ...otherUpdateFields } = req.body;

    try {
      // Traiter le tableau 'cast' pour trouver/créer les acteurs
      const newCastForDB = await Promise.all(
        castData.map(async (castMember) => {
          if (!castMember.firstName || !castMember.lastName) return null;

          const actor = await Actor.findOneAndUpdate(
            { firstName: castMember.firstName, lastName: castMember.lastName },
            { $set: { photo: castMember.photo } },
            { new: true, upsert: true } // Crée l'acteur s'il n'existe pas
          );

          return {
            character: castMember.character,
            order: castMember.order,
            actor: actor._id,
          };
        })
      );

      // Combiner les champs du film et le nouveau cast formaté
      const finalUpdatePayload = {
        ...otherUpdateFields,
        cast: newCastForDB.filter(Boolean), // .filter(Boolean) pour enlever les entrées null
      };

      const updatedContent = await Content.findByIdAndUpdate(
        contentId,
        { $set: finalUpdatePayload },
        { new: true, runValidators: true }
      ).populate("cast.actor");

      if (!updatedContent) {
        return res.status(404).json({ message: "Contenu non trouvé." });
      }

      res.json({
        message: "Contenu mis à jour avec succès",
        data: updatedContent,
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour du contenu :", err);
      res
        .status(500)
        .json({ message: "Erreur interne du serveur.", error: err.message });
    }
  });
};
