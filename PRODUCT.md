# Product

## Register

product

## Users

- **Spectateurs** (surface client) : grand public francophone, session détente le soir, cherchent un contenu et le lancent sans friction. Surface sombre « Cinéma sombre ».
- **Administrateurs** (surface admin) : l'exploitant du catalogue Handflix. Gère films, séries, utilisateurs, abonnements, messages support. Travaille de jour, sessions de gestion répétées — la surface admin est un outil, pas une vitrine.

## Product Purpose

Handflix est une plateforme de streaming vidéo (MERN) : catalogue films/séries, lecture, favoris, historique, notation, abonnements payants, recommandations, support par chat IA. Succès = un spectateur trouve et lance un contenu en moins de 30 secondes ; un admin comprend l'état de la plateforme en un coup d'œil.

## Brand Personality

Cinéphile, immersif, précis. Le contenu d'abord ; l'interface s'efface ; l'exécution est soignée jusqu'au détail.

## Anti-references

- Dashboards SaaS génériques : hero-metric avec gradient, grilles de cartes identiques, eyebrows uppercase au-dessus de chaque section.
- Glassmorphism décoratif, gradients violets d'ambiance, lueurs néon.
- Interfaces « démo template » : données fake, boutons morts, états manquants.

## Design Principles

1. **Le contenu est roi** — affiches et données réelles portent l'écran ; la décoration ne rivalise jamais avec elles.
2. **Deux registres, une maison** — client sombre immersif (« Cinéma sombre »), admin clair outillé (« Atelier violet », tokens ProtoPie) ; chacun assume sa fonction, les deux partagent la précision.
3. **La familiarité se mérite** — composants standards exécutés parfaitement plutôt qu'affordances inventées.
4. **Le mouvement informe** — chaque animation traduit un état (chargement, transition, feedback) ; 150–250 ms, jamais de chorégraphie qui bloque la tâche.
5. **Chaque état existe** — vide, chargement (skeleton), erreur, succès, débordement : conçus, pas subis.

## Accessibility & Inclusion

- Cible WCAG 2.1 AA : contraste ≥ 4.5:1 texte courant, ≥ 3:1 grands textes.
- `prefers-reduced-motion` respecté sur toute animation.
- Navigation clavier complète, focus visible sur la surface admin (outil de travail).
- Interface en français.
