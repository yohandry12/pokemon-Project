const auth = require("../src/auth/authAdmin");
const Content = require("../src/models/MODÈLE CONTENU/films");
const Genre = require("../src/models/MODÈLE GENRE/genre");
const Actor = require("../src/models/MODÈLE ACTEUR/acteur");

module.exports = (app) => {
  app.post("/api/create/film", auth, async (req, res) => {
    try {
      // Conversion des slugs de genres en ObjectId
      let genresSlugs = req.body.genres;
      if (!Array.isArray(genresSlugs)) {
        genresSlugs = [genresSlugs];
      }
      const genresDocs = await Genre.find({ slug: { $in: genresSlugs } });
      if (genresDocs.length !== genresSlugs.length) {
        return res.status(400).json({ message: "Un ou plusieurs genres sont invalides." });
      }
      req.body.genres = genresDocs.map(g => g._id);

      // Gestion des acteurs (cast)
      if (req.body.cast && Array.isArray(req.body.cast)) {
        const castArray = [];
        for (const castItem of req.body.cast) {
          // Recherche d'un acteur existant (par prénom + nom)
          let actor = await Actor.findOne({
            firstName: castItem.firstName,
            lastName: castItem.lastName
          });
          if (!actor) {
            // Création de l'acteur si non trouvé
            actor = new Actor({
              firstName: castItem.firstName,
              lastName: castItem.lastName,
              birthDate: castItem.birthDate,
              nationality: castItem.nationality,
              biography: castItem.biography,
              photo: castItem.photo // URL de la photo
            });
            await actor.save();
          }
          // Ajout au cast du film/série
          castArray.push({
            actor: actor._id,
            character: castItem.character,
            order: castItem.order
          });
        }
        req.body.cast = castArray;
      }

      const content = new Content(req.body);
      await content.save();
      const message = `Le contenu '${content.title}' a bien été créé.`;
      res.status(201).json({ message, data: content });
    } catch (error) {
      let messageError = "Le contenu n'a pas pu être créé. Vérifiez les données envoyées.";
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: messageError, data: error });
      }
      res.status(500).json({ message: messageError, data: error });
    }
  });
}; 