import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

const articles = [
  {
    title: "Le gouvernement présente son plan de relance économique pour 2026",
    excerpt: "Face à la stagnation de la croissance, le premier ministre a dévoilé un plan ambitieux de 15 milliards d'euros pour relancer l'investissement public et privé.",
    content: `<p>Face à la stagnation de la croissance, le premier ministre a dévoilé un plan ambitieux de 15 milliards d'euros pour relancer l'investissement public et privé. Ce plan prévoit notamment des baisses de charges pour les PME, un fonds d'investissement dans les technologies vertes et un programme de rénovation des infrastructures publiques.</p><p>Les économistes restent partagés sur l'efficacité des mesures proposées. Si certains saluent l'effort budgétaire, d'autres pointent le risque d'un creusement du déficit à un moment où les marchés financiers scrutent de près la trajectoire des finances publiques françaises.</p><p>L'opposition a immédiatement réagi, qualifiant le plan de "trop peu, trop tard" tout en réclamant des baisses d'impôts plus massives pour les ménages. Le vote au Parlement est prévu pour le mois prochain.</p>`,
    rubrique: "Économie",
    author: "Marie Dupont",
    tags: JSON.stringify(["économie", "gouvernement", "relance", "budget"]),
    isPremium: false,
    articleType: "Analyse",
  },
  {
    title: "Guerre en Ukraine : les négociations de paix reprennent à Genève",
    excerpt: "Pour la première fois depuis dix-huit mois, des représentants ukrainiens et russes se retrouvent à la table des négociations sous l'égide des Nations unies.",
    content: `<p>Pour la première fois depuis dix-huit mois, des représentants ukrainiens et russes se retrouvent à la table des négociations sous l'égide des Nations unies. La rencontre, qualifiée d'"exploratoire" par les deux parties, vise à établir un cadre pour des discussions futures sur un cessez-le-feu.</p><p>Les diplomates occidentaux ont accueilli ces pourparlers avec un optimisme prudent, rappelant que les positions des deux belligérants restent très éloignées sur les questions territoriales. L'Ukraine insiste sur le retrait total des forces russes, tandis que Moscou refuse de discuter des territoires qu'elle considère comme annexés.</p><p>Sur le terrain, les combats se poursuivent néanmoins dans l'Est du pays, où les forces ukrainiennes font face à une pression accrue dans la région de Zaporijjia.</p>`,
    rubrique: "International",
    author: "Jean-Pierre Martin",
    tags: JSON.stringify(["ukraine", "russie", "guerre", "diplomatie", "ONU"]),
    isPremium: false,
  },
  {
    title: "Réforme des retraites : le Conseil constitutionnel valide l'essentiel du texte",
    excerpt: "Le Conseil constitutionnel a rendu sa décision sur la réforme des retraites, validant le report de l'âge légal à 64 ans tout en censurant plusieurs dispositions secondaires.",
    content: `<p>Le Conseil constitutionnel a rendu sa décision sur la réforme des retraites, validant le report de l'âge légal à 64 ans tout en censurant plusieurs dispositions secondaires. La décision met fin à plusieurs semaines de forte mobilisation sociale qui avait paralysé certains secteurs de l'économie.</p><p>Les syndicats ont annoncé qu'ils poursuivraient leur opposition à la réforme, appelant à une nouvelle journée de mobilisation nationale. La CGT et la CFDT, pour une fois unis, ont qualifié la décision de "coup de force contre la démocratie sociale".</p><p>Le gouvernement, pour sa part, a salué la validation constitutionnelle et appelé à "tourner la page" pour se concentrer sur la mise en œuvre de la réforme, prévue pour entrer en vigueur en septembre prochain.</p>`,
    rubrique: "France",
    author: "Sophie Leblanc",
    tags: JSON.stringify(["retraites", "réforme", "politique", "syndicats"]),
    isPremium: true,
  },
  {
    title: "Intelligence artificielle : la France dévoile sa stratégie nationale",
    excerpt: "Cinq milliards d'euros sur cinq ans, dix nouveaux centres de recherche et un cadre réglementaire adapté : Paris veut rattraper son retard face aux géants américains et chinois.",
    content: `<p>Cinq milliards d'euros sur cinq ans, dix nouveaux centres de recherche et un cadre réglementaire adapté : Paris veut rattraper son retard face aux géants américains et chinois dans la course à l'intelligence artificielle. La stratégie nationale IA a été présentée lors d'une conférence à l'École Polytechnique.</p><p>Les acteurs du secteur ont accueilli favorablement l'annonce, même si certains experts estiment que les montants alloués restent insuffisants face aux investissements colossaux des États-Unis et de la Chine, qui se comptent en centaines de milliards de dollars.</p><p>La question de la souveraineté numérique est au cœur du dispositif, avec la volonté affichée de développer des modèles de langage "européens" capables de rivaliser avec ChatGPT ou Gemini tout en respectant les valeurs démocratiques et la protection des données personnelles.</p>`,
    rubrique: "Sciences",
    author: "Thomas Renard",
    tags: JSON.stringify(["IA", "technologie", "innovation", "numérique"]),
    isPremium: false,
  },
  {
    title: "Festival de Cannes 2026 : la Palme d'or décernée à un film brésilien",
    excerpt: "Le jury présidé par Cate Blanchett a récompensé 'Terra Prometida' du réalisateur Paulo Salave'a, une fresque épique sur les peuples indigènes d'Amazonie.",
    content: `<p>Le jury présidé par Cate Blanchett a récompensé "Terra Prometida" du réalisateur Paulo Salave'a, une fresque épique sur les peuples indigènes d'Amazonie face à la déforestation. Le film, salué par la critique pour sa beauté formelle et son engagement politique, remporte la plus haute distinction du cinéma mondial.</p><p>La cérémonie de clôture a également vu le Grand Prix attribué à la réalisatrice française Céline Sciamma pour son troisième long-métrage, "Les Absents", une méditation sur le deuil et la mémoire. Le Prix d'interprétation masculine est revenu à l'acteur sud-coréen Lee Jung-jae.</p><p>Cette édition du festival a été marquée par une forte présence des cinémas du Sud global, témoignant d'un renouveau de la diversité dans la sélection officielle.</p>`,
    rubrique: "Culture",
    author: "Isabelle Fontaine",
    tags: JSON.stringify(["cannes", "cinéma", "palme d'or", "festival"]),
    isPremium: false,
  },
  {
    title: "Roland-Garros : Djokovic s'impose pour un record historique",
    excerpt: "À 38 ans, le Serbe a remporté son vingt-quatrième Roland-Garros, battant en finale l'Espagnol Carlos Alcaraz en quatre sets.",
    content: `<p>À 38 ans, le Serbe a remporté son vingt-quatrième Roland-Garros, battant en finale l'Espagnol Carlos Alcaraz en quatre sets (6-3, 4-6, 6-1, 7-5). Une performance qui laisse sans voix les observateurs du tennis mondial, qui pensaient l'ère Djokovic révolue.</p><p>Dans un court Philippe-Chatrier en liesse, le champion a fondu en larmes à l'issue du match, déclarant que ce titre "dépasse tout ce que j'avais imaginé". Alcaraz, 22 ans, a été fair-play dans la défaite, saluant "la légende absolue du tennis".</p><p>Cette victoire relance le débat sur le GOAT (Greatest Of All Time), Djokovic portant désormais son total de Grands Chelems à 29, loin devant Nadal (22) et Federer (20). Il devient également le joueur le plus âgé à remporter un Grand Chelem de l'ère Open.</p>`,
    rubrique: "Sport",
    author: "Pierre Durand",
    tags: JSON.stringify(["tennis", "roland-garros", "djokovic", "grand chelem"]),
    isPremium: false,
  },
  {
    title: "Crise du logement : Paris impose un plafonnement des loyers étendu",
    excerpt: "La mairie de Paris a décidé d'étendre le dispositif d'encadrement des loyers à l'ensemble du territoire métropolitain, une mesure qui devrait concerner plus de 700 000 logements.",
    content: `<p>La mairie de Paris a décidé d'étendre le dispositif d'encadrement des loyers à l'ensemble du territoire métropolitain, une mesure qui devrait concerner plus de 700 000 logements. Le loyer de référence sera désormais calculé par quartier et par type de bien.</p><p>Les propriétaires et les agences immobilières ont immédiatement annoncé leur intention de contester la mesure en justice, arguant qu'elle découragera l'investissement locatif et aggravera encore la pénurie de logements disponibles.</p><p>Du côté des associations de locataires, on se réjouit d'une mesure "attendue depuis trop longtemps", en soulignant que Paris est l'une des villes les plus chères d'Europe où le taux d'effort des ménages modestes dépasse régulièrement 40% de leurs revenus.</p>`,
    rubrique: "France",
    author: "Camille Petit",
    tags: JSON.stringify(["logement", "paris", "loyers", "immobilier"]),
    isPremium: true,
  },
  {
    title: "Climat : le rapport du GIEC alerte sur l'accélération du réchauffement",
    excerpt: "Le dernier rapport du Groupe d'experts intergouvernemental sur l'évolution du climat confirme que la planète se réchauffe plus vite que prévu, avec des conséquences désormais irréversibles.",
    content: `<p>Le dernier rapport du Groupe d'experts intergouvernemental sur l'évolution du climat confirme que la planète se réchauffe plus vite que prévu, avec des conséquences désormais irréversibles pour certains écosystèmes. Le rapport préconise une réduction d'urgence des émissions de gaz à effet de serre.</p><p>Les scientifiques soulignent que les événements climatiques extrêmes — canicules, inondations, sécheresses — se multiplient à un rythme sans précédent. En 2025, plus de 3 milliards de personnes ont été exposées à des chaleurs extrêmes au moins une fois dans l'année.</p><p>Le rapport appelle les gouvernements à accélérer massivement la transition énergétique, notant que les investissements actuels dans les énergies renouvelables, bien qu'en forte croissance, restent insuffisants pour maintenir le réchauffement sous la barre des 1,5°C.</p>`,
    rubrique: "Sciences",
    author: "Élise Bernard",
    tags: JSON.stringify(["climat", "GIEC", "réchauffement", "environnement"]),
    isPremium: false,
  },
  {
    title: "Municipales 2026 : la gauche unie remporte Lyon et Bordeaux",
    excerpt: "Les élections municipales partielles ont vu la victoire de la coalition de gauche dans deux grandes métropoles, un signal fort à un an des élections législatives.",
    content: `<p>Les élections municipales partielles ont vu la victoire de la coalition de gauche dans deux grandes métropoles, un signal fort à un an des élections législatives. À Lyon, la liste conduite par l'écologiste Sandrine Rousseau l'emporte avec 54% des voix, tandis qu'à Bordeaux, le socialiste Laurent Dumas s'impose au second tour.</p><p>Ces résultats confirment la recomposition du paysage politique français, avec une gauche unie qui progresse dans les grandes villes éduquées, tandis que le Rassemblement national consolide ses positions dans les zones périurbaines et rurales.</p><p>L'analyse du vote montre une forte abstention chez les 18-35 ans dans les deux villes, malgré une légère amélioration par rapport aux scrutins précédents, un phénomène qui préoccupe l'ensemble de la classe politique.</p>`,
    rubrique: "Politique",
    author: "François Moreau",
    tags: JSON.stringify(["municipales", "élections", "gauche", "politique"]),
    isPremium: true,
  },
  {
    title: "L'Opéra de Paris entre dans une nouvelle ère avec son directeur artistique",
    excerpt: "Nommé il y a six mois, Benjamin Millepied présente sa première saison complète, marquée par l'ouverture à la danse contemporaine et à la diversité des compagnies invitées.",
    content: `<p>Nommé il y a six mois, le nouveau directeur artistique de l'Opéra de Paris présente sa première saison complète, marquée par l'ouverture à la danse contemporaine et à la diversité des compagnies invitées. Une rupture assumée avec la tradition classique qui ne fait pas l'unanimité.</p><p>Parmi les temps forts de la saison : une collaboration avec le chorégraphe William Forsythe, une création mondiale de la compositrice Kaija Saariaho et une série de représentations dédiées aux traditions chorégraphiques africaines. Le Palais Garnier accueillera également une résidence de la compagnie néerlandaise NDT.</p><p>Certains défenseurs du répertoire classique s'inquiètent d'un "effacement" du patrimoine chorégraphique français. Le directeur se défend : "On ne remplace pas Petipa par Forsythe, on les fait dialoguer."</p>`,
    rubrique: "Culture",
    author: "Amélie Simon",
    tags: JSON.stringify(["opéra", "danse", "culture", "Paris"]),
    isPremium: false,
  },
  {
    title: "Coupe du Monde 2026 : la France tire les États-Unis en quart de finale",
    excerpt: "Le tirage au sort des quarts de finale de la Coupe du monde organisée aux États-Unis, au Canada et au Mexique a réservé un choc entre les Bleus et les hôtes américains.",
    content: `<p>Le tirage au sort des quarts de finale de la Coupe du monde organisée aux États-Unis, au Canada et au Mexique a réservé un choc entre les Bleus et les hôtes américains. Le match est prévu le 4 juillet à Los Angeles, date symbolique pour les États-Unis.</p><p>L'équipe de France, qualifiée avec la manière après trois victoires en phase de groupes, affrontera un adversaire américain ragaillardi par l'euphorie du public. L'attaquant français Kylian Mbappé, auteur de cinq buts en phase de poules, sera la principale menace pour la défense des États-Unis.</p><p>Les bookmakers donnent la France favorite, mais les analystes rappellent que le contexte de pression populaire aux États-Unis pourrait renverser bien des pronostics. Les deux équipes se retrouvent pour la première fois en phase finale depuis le Mondial 2014.</p>`,
    rubrique: "Sport",
    author: "Marc Lebrun",
    tags: JSON.stringify(["football", "coupe du monde", "france", "équipe nationale"]),
    isPremium: false,
  },
  {
    title: "Hausse des prix alimentaires : les industriels pointés du doigt",
    excerpt: "Malgré la baisse de l'inflation générale, les prix des produits alimentaires continuent d'augmenter. Une enquête parlementaire met en cause les pratiques des grands groupes industriels.",
    content: `<p>Malgré la baisse de l'inflation générale, les prix des produits alimentaires continuent d'augmenter. Une enquête parlementaire met en cause les pratiques des grands groupes industriels, qui auraient profité de la période inflationniste pour reconstituer leurs marges au détriment des consommateurs.</p><p>Le rapport pointe notamment le cas de plusieurs multinationales de l'agroalimentaire dont les marges opérationnelles ont progressé de 15 à 25% entre 2022 et 2025, pendant que le pouvoir d'achat des ménages français se dégradait. Les associations de consommateurs réclament des mesures coercitives.</p><p>Les industriels contestent ces chiffres et mettent en avant la hausse du coût des matières premières, de l'énergie et de la main-d'œuvre. Des négociations avec la grande distribution sont en cours pour définir un nouveau cadre tarifaire.</p>`,
    rubrique: "Économie",
    author: "Nathalie Blanc",
    tags: JSON.stringify(["alimentation", "inflation", "pouvoir d'achat", "industrie"]),
    isPremium: true,
  },
  {
    title: "Migration : l'accord entre l'Union européenne et la Tunisie est fragilisé",
    excerpt: "Le partenariat migratoire signé en 2023 entre Bruxelles et Tunis connaît de sérieuses turbulences, alors que les traversées en Méditerranée centrale ont repris de plus belle.",
    content: `<p>Le partenariat migratoire signé en 2023 entre Bruxelles et Tunis connaît de sérieuses turbulences, alors que les traversées en Méditerranée centrale ont repris de plus belle. Plusieurs ONG documentent des violations graves des droits des migrants par les garde-côtes tunisiens.</p><p>Le Parlement européen a voté une résolution non contraignante demandant la suspension de l'accord, s'appuyant sur des rapports de l'UNHCR faisant état de refoulements illégaux et de mauvais traitements. La Commission européenne se retrouve dans une position délicate, tiraillée entre sa politique migratoire et ses engagements en matière de droits fondamentaux.</p><p>La Tunisie, de son côté, réclame une augmentation substantielle des aides prévues dans l'accord, estimant que les 105 millions d'euros alloués sont insuffisants face à l'ampleur du défi migratoire auquel elle fait face.</p>`,
    rubrique: "International",
    author: "Laurent Vidal",
    tags: JSON.stringify(["migration", "Europe", "Tunisie", "Méditerranée"]),
    isPremium: false,
  },
  {
    title: "La réforme de l'école primaire suscite l'inquiétude des enseignants",
    excerpt: "Le nouveau programme de l'école primaire, centré sur les fondamentaux et une évaluation plus fréquente des élèves, est contesté par une large partie du corps enseignant.",
    content: `<p>Le nouveau programme de l'école primaire, centré sur les fondamentaux et une évaluation plus fréquente des élèves, est contesté par une large partie du corps enseignant. Une pétition a recueilli plus de 200 000 signatures en une semaine.</p><p>Les enseignants reprochent à la réforme une vision "trop normative" de l'apprentissage qui laisserait peu de place à la créativité et à la différenciation pédagogique. Ils dénoncent également le manque de concertation dans l'élaboration des nouveaux textes.</p><p>Le ministre de l'Éducation nationale défend une réforme nécessaire au vu des résultats des élèves français dans les enquêtes PISA, qui montrent une détérioration des compétences en lecture et en mathématiques sur dix ans. Des assises nationales sont prévues pour le mois de septembre.</p>`,
    rubrique: "Société",
    author: "Claire Dupuis",
    tags: JSON.stringify(["éducation", "école", "réforme", "enseignants"]),
    isPremium: false,
  },
  {
    title: "Musique : le retour surprise de Daft Punk fait trembler l'industrie",
    excerpt: "Trente ans après leur premier album, le duo électronique français annonce un nouvel opus et une tournée mondiale, provoquant une hystérie collective sur les réseaux sociaux.",
    content: `<p>Trente ans après leur premier album, le duo électronique français annonce un nouvel opus et une tournée mondiale, provoquant une hystérie collective sur les réseaux sociaux. L'annonce, diffusée via une simple vidéo teaser de 30 secondes, a généré plus de 50 millions de vues en 24 heures.</p><p>Le retour de Thomas Bangalter et Guy-Manuel de Homem-Christo, séparés depuis 2021, était l'un des secrets les mieux gardés de l'industrie musicale. Selon les premières informations, le nouvel album mêlerait sonorités électroniques et orchestration classique.</p><p>Les billetteries pour les premières dates européennes ont été submergées dès l'ouverture des ventes, avec des dizaines de millions de personnes tentant simultanément de réserver des places. Une tournée française est prévue à l'automne, avec notamment trois soirs à la Paris La Défense Arena.</p>`,
    rubrique: "Culture",
    author: "Hugo Castaing",
    tags: JSON.stringify(["musique", "daft punk", "électro", "tournée"]),
    isPremium: false,
  },
  {
    title: "Santé : une percée majeure contre la maladie d'Alzheimer",
    excerpt: "Des chercheurs de l'Inserm annoncent avoir identifié un mécanisme cellulaire clé dans le développement de la maladie, ouvrant la voie à de nouvelles thérapies.",
    content: `<p>Des chercheurs de l'Inserm annoncent avoir identifié un mécanisme cellulaire clé dans le développement de la maladie d'Alzheimer, ouvrant la voie à de nouvelles thérapies ciblées. Les résultats, publiés dans la revue Nature, représentent une avancée significative dans la compréhension de cette pathologie.</p><p>L'équipe dirigée par le professeur Christine Leblanc a découvert que certaines cellules gliales jouent un rôle actif dans la propagation des plaques amyloïdes, contrairement à ce que l'on pensait jusqu'alors. Cette découverte remet en question certaines approches thérapeutiques en cours d'évaluation.</p><p>Les essais cliniques sur la base de cette découverte devraient débuter dans les 18 mois, selon les chercheurs. France Alzheimer salue "une avancée historique" tout en appelant à ne pas susciter de faux espoirs chez les quelque 900 000 patients français et leurs familles.</p>`,
    rubrique: "Sciences",
    author: "Docteur Anne Rousseau",
    tags: JSON.stringify(["santé", "alzheimer", "recherche", "médecine"]),
    isPremium: true,
  },
  {
    title: "Tour de France 2026 : Pogacar domine la montagne, Vingegaard résiste",
    excerpt: "À l'issue de la quinzième étape alpine, le Slovène Tadej Pogacar s'est emparé du maillot jaune au terme d'une bataille épique dans les cols pyrénéens.",
    content: `<p>À l'issue de la quinzième étape alpine, le Slovène Tadej Pogacar s'est emparé du maillot jaune au terme d'une bataille épique dans les cols pyrénéens. Il devance désormais son rival danois Jonas Vingegaard de 1'23" au classement général.</p><p>La journée a été marquée par une attaque décisive de Pogacar dans la montée vers le col du Galibier, à 45 kilomètres de l'arrivée. Vingegaard, qui avait semblé en difficulté dans la première partie de l'étape, a réussi à limiter les dégâts grâce à un effort surhumain dans la descente.</p><p>Les observateurs notent que ce Tour 2026 s'annonce comme le plus disputé depuis des années, avec seulement 47 secondes séparant les deux favoris avant les derniers cols alpins. La bataille devrait se conclure dans l'Alpe d'Huez vendredi.</p>`,
    rubrique: "Sport",
    author: "Julien Mercier",
    tags: JSON.stringify(["cyclisme", "tour de france", "pogacar", "vélo"]),
    isPremium: false,
  },
  {
    title: "Chine-Taïwan : les tensions atteignent un nouveau sommet",
    excerpt: "Pékin a effectué des exercices militaires d'une ampleur sans précédent autour de l'île, répondant à la visite du président américain à Taipei.",
    content: `<p>Pékin a effectué des exercices militaires d'une ampleur sans précédent autour de l'île de Taïwan, en réponse à la visite du président américain à Taipei. L'Armée populaire de libération a déployé une centaine d'avions de combat et une vingtaine de navires de guerre dans le détroit.</p><p>Washington a condamné "avec la plus grande fermeté" ce qu'il qualifie de "déstabilisation délibérée", annonçant l'envoi de deux porte-avions supplémentaires dans la région. L'Alliance Quad — États-Unis, Australie, Inde, Japon — a convoqué une réunion d'urgence.</p><p>Les marchés financiers asiatiques ont plongé à l'ouverture, le Nikkei perdant 4,2% et le Hang Seng 5,8%. Les analystes géopolitiques avertissent que la situation est "la plus dangereuse depuis la crise de 1996", mais excluent pour l'instant un scénario militaire imminent.</p>`,
    rubrique: "International",
    author: "Mathieu Duval",
    tags: JSON.stringify(["chine", "taïwan", "géopolitique", "états-unis"]),
    isPremium: true,
  },
  {
    title: "Automobile : Renault présente sa première voiture 100% hydrogène",
    excerpt: "Au Salon de Paris, Renault dévoile la Scénic H2, une berline familiale à pile à combustible affichant 800 km d'autonomie et un temps de recharge de 5 minutes.",
    content: `<p>Au Salon de Paris, Renault dévoile la Scénic H2, une berline familiale à pile à combustible affichant 800 km d'autonomie et un temps de recharge de 5 minutes. Un défi technologique qui pourrait rebattre les cartes dans la compétition électrique.</p><p>Le prix annoncé — 45 000 euros en finition de base — positionne le véhicule dans le segment premium. Le constructeur mise sur le développement du réseau de stations hydrogène, encore très limité en France avec moins de 50 points de recharge sur l'ensemble du territoire.</p><p>Les concurrents Toyota et Hyundai, déjà présents sur ce segment avec leurs modèles Mirai et Nexo, ont accueilli l'annonce avec intérêt. Les experts du secteur s'interrogent cependant sur la capacité du marché à absorber simultanément le développement des infrastructures électriques et hydrogène.</p>`,
    rubrique: "Économie",
    author: "Vincent Mercier",
    tags: JSON.stringify(["automobile", "hydrogène", "renault", "technologie"]),
    isPremium: false,
  },
  {
    title: "Littérature : le Goncourt couronne un premier roman africain",
    excerpt: "L'Académie Goncourt a attribué son prix à 'Les Enfants du fleuve' de la romancière congolaise Adèle Mwamba-Kasongo, un roman de formation entre Kinshasa et Paris.",
    content: `<p>L'Académie Goncourt a attribué son prix à "Les Enfants du fleuve" de la romancière congolaise Adèle Mwamba-Kasongo, un roman de formation entre Kinshasa et Paris. Premier Goncourt pour un roman écrit par un auteur africain vivant sur le continent.</p><p>Le livre, qui retrace l'histoire d'une jeune femme traversant le Congo et l'Europe à la recherche de son père disparu, avait été salué par la critique pour sa prose éblouissante et la complexité de ses personnages. Il était considéré comme le favori depuis la rentrée littéraire.</p><p>Dans son discours de remerciement, l'autrice a dédié son prix "à tous ceux qui écrivent dans des langues que l'Académie française n'entend pas encore". Son livre, publié par Gallimard, a déjà dépassé les 200 000 exemplaires vendus depuis la parution en août.</p>`,
    rubrique: "Culture",
    author: "Christine Arnaud",
    tags: JSON.stringify(["littérature", "goncourt", "prix", "romans"]),
    isPremium: false,
  },
  {
    title: "Grève des transports : la SNCF et la RATP paralysées pendant 72 heures",
    excerpt: "Un mouvement social interprofessionnel a cloué au sol une grande partie des trains et métros en France, perturbant des millions de voyageurs pendant trois jours.",
    content: `<p>Un mouvement social interprofessionnel a cloué au sol une grande partie des trains et métros en France, perturbant des millions de voyageurs pendant trois jours. Le préavis de grève, déposé par cinq syndicats, porte sur les salaires et les conditions de travail.</p><p>À la SNCF, le taux de grévistes a atteint 42% chez les conducteurs de TGV, entraînant l'annulation de près de 60% des trains à grande vitesse. Les Intercités et les TER ont été encore plus touchés. À la RATP, seules les lignes automatisées (1 et 14) ont fonctionné normalement.</p><p>Le gouvernement a appelé à la reprise des négociations, tandis que les directions des deux entreprises publiques ont maintenu leurs offres salariales jugées "insuffisantes" par les syndicats. Un accord de fin de conflit est attendu pour le weekend.</p>`,
    rubrique: "France",
    author: "Bertrand Lefort",
    tags: JSON.stringify(["grève", "SNCF", "RATP", "transports"]),
    isPremium: false,
  },
  {
    title: "Nucléaire : EDF annonce la construction de six nouveaux EPR2",
    excerpt: "Le groupe électricien a officialisé la commande de six réacteurs nouvelle génération, pour une mise en service progressive entre 2035 et 2045, au nom de la souveraineté énergétique française.",
    content: `<p>Le groupe électricien a officialisé la commande de six réacteurs EPR2 nouvelle génération, pour une mise en service progressive entre 2035 et 2045. L'investissement total est estimé à 65 milliards d'euros, dont une partie sera financée par l'État.</p><p>Cette décision marque un tournant dans la politique énergétique française après des années de réduction progressive du parc nucléaire. Le président de la République avait annoncé cette relance en 2022, mais les procédures administratives et les discussions financières avaient retardé la concrétisation.</p><p>Les associations écologistes dénoncent un "choix du passé" qui détournerait des ressources financières des énergies renouvelables. Les partisans du nucléaire y voient au contraire la garantie d'une électricité décarbonée et pilotable, essentielle à la sécurité d'approvisionnement de la France.</p>`,
    rubrique: "Économie",
    author: "Patricia Colomb",
    tags: JSON.stringify(["nucléaire", "énergie", "EDF", "EPR"]),
    isPremium: true,
  },
  {
    title: "Jeux Paralympiques : la France bat son record de médailles",
    excerpt: "Avec 42 médailles dont 18 en or, la délégation française aux Jeux Paralympiques d'été bat son précédent record et se classe cinquième nation au tableau des médailles.",
    content: `<p>Avec 42 médailles dont 18 en or, la délégation française aux Jeux Paralympiques d'été bat son précédent record et se classe cinquième nation au tableau des médailles, derrière la Chine, les États-Unis, la Grande-Bretagne et l'Australie.</p><p>Les nageurs français ont été les plus titrés, remportant 11 médailles dont 6 en or. La championne Théa Lacroix, 19 ans, s'est imposée comme la révélation des jeux en remportant trois titres individuels et en établissant deux records du monde dans la catégorie S7.</p><p>Le Comité paralympique français annonce vouloir capitaliser sur ce succès pour développer davantage le parasport dans les clubs amateurs. L'accessibilité des installations sportives reste cependant un défi majeur, avec seulement 15% des équipements sportifs français pleinement accessibles aux personnes handicapées.</p>`,
    rubrique: "Sport",
    author: "Alice Moreau",
    tags: JSON.stringify(["paralympiques", "sport", "france", "médailles"]),
    isPremium: false,
  },
  {
    title: "Sécurité routière : record de mortalité en baisse pour la troisième année consécutive",
    excerpt: "Le nombre de morts sur les routes françaises a reculé de 8% en 2025, selon le bilan annuel de la Sécurité routière, grâce notamment au déploiement des radars de nouvelle génération.",
    content: `<p>Le nombre de morts sur les routes françaises a reculé de 8% en 2025, selon le bilan annuel de la Sécurité routière. Ce troisième recul consécutif porte le nombre annuel de décès sous la barre des 3 000 pour la première fois depuis le début des statistiques modernes.</p><p>Les facteurs explicatifs identifiés par le rapport sont multiples : déploiement de 500 nouveaux radars intelligents capables de détecter l'usage du téléphone au volant, extension du contrôle technique aux deux-roues motorisés et renforcement des contrôles d'alcoolémie.</p><p>La sécurité routière souligne cependant que le nombre d'accidents impliquant des vélos et des trottinettes électriques a augmenté de 23%, reflétant l'essor de ces modes de transport alternatifs. Un plan vélo sécurité est en cours d'élaboration.</p>`,
    rubrique: "Société",
    author: "René Gautier",
    tags: JSON.stringify(["sécurité routière", "accidents", "transports", "prévention"]),
    isPremium: false,
  },
  {
    title: "Diplomatie : Emmanuel Macron au Brésil pour renforcer l'axe franco-brésilien",
    excerpt: "Le président français entame une visite d'État de trois jours à Brasilia et São Paulo pour relancer le partenariat stratégique entre les deux pays et signer plusieurs accords commerciaux.",
    content: `<p>Le président français entame une visite d'État de trois jours à Brasilia et São Paulo pour relancer le partenariat stratégique entre les deux pays et signer plusieurs accords commerciaux. Une visite chargée de symboles à l'heure où l'Europe cherche à diversifier ses alliances face aux pressions américaines et chinoises.</p><p>Au programme : signature d'un accord de coopération sur la transition énergétique, discussions sur la finalisation de l'accord de libre-échange UE-Mercosur et échanges sur la gouvernance mondiale de l'intelligence artificielle. Les deux pays co-présideront le sommet du G20 consacré au numérique en octobre.</p><p>Sur le plan économique, les échanges franco-brésiliens ont progressé de 18% en 2025, portés par les exportations d'Airbus et de matériel électrique. Les entreprises françaises sont la troisième source d'investissements directs étrangers au Brésil.</p>`,
    rubrique: "International",
    author: "Philippe Arnaud",
    tags: JSON.stringify(["diplomatie", "brésil", "macron", "france"]),
    isPremium: false,
  },
  {
    title: "Lutte contre la corruption : Transparency International publie son classement 2026",
    excerpt: "La France gagne quatre places dans le classement mondial de la perception de la corruption pour s'établir au 21e rang, une amélioration saluée par l'organisation mais encore jugée insuffisante.",
    content: `<p>La France gagne quatre places dans le classement mondial de la perception de la corruption de Transparency International pour s'établir au 21e rang mondial, une amélioration saluée par l'organisation mais encore jugée insuffisante au regard de son niveau de développement institutionnel.</p><p>Les progrès enregistrés sont attribués à l'activité accrue du Parquet national financier, qui a engagé une cinquantaine de nouvelles procédures en 2025, et au renforcement des obligations déclaratives des élus et hauts fonctionnaires.</p><p>L'organisation pointe cependant des insuffisances dans la protection des lanceurs d'alerte, un domaine où la France reste en retard par rapport à ses voisins européens, et dans la prévention des conflits d'intérêts dans le secteur para-public.</p>`,
    rubrique: "Société",
    author: "Sylvie Marchand",
    tags: JSON.stringify(["corruption", "transparence", "governance", "classement"]),
    isPremium: true,
  },
  {
    title: "Architecture : la rénovation du Palais-Royal achevée après cinq ans de travaux",
    excerpt: "Cinq ans de travaux, 180 millions d'euros, un chantier colossal : le Palais-Royal retrouve ses fastes du XVIIIe siècle après une restauration complète de ses galeries et jardins.",
    content: `<p>Cinq ans de travaux, 180 millions d'euros, un chantier colossal : le Palais-Royal retrouve ses fastes du XVIIIe siècle après une restauration complète de ses galeries et jardins. La réouverture au public a attiré des milliers de Parisiens et de touristes dès le premier jour.</p><p>Le chantier, mené sous la direction du Centre des monuments nationaux, a permis de restaurer 380 mètres de galeries, de rénover entièrement les jardins en rétablissant le plan originel de l'architecte Contant d'Ivry, et de créer un espace muséal de 2 000 m² dans les caves du palais.</p><p>La ministre de la Culture a salué "un exemple de ce que la France sait faire de mieux : prendre soin de son patrimoine tout en l'ouvrant au plus grand nombre". Le site, qui accueille habituellement 2 millions de visiteurs par an, espère dépasser les 3 millions dès cette année.</p>`,
    rubrique: "Culture",
    author: "Élodie Morin",
    tags: JSON.stringify(["patrimoine", "architecture", "paris", "rénovation"]),
    isPremium: false,
  },
  {
    title: "Technologie : Apple annonce l'iPhone 18 avec capteur satellite intégré",
    excerpt: "La nouvelle génération de l'iPhone embarque pour la première fois un véritable modem satellite bidirectionnel, permettant des appels et des connexions Internet dans les zones sans couverture cellulaire.",
    content: `<p>La nouvelle génération de l'iPhone embarque pour la première fois un véritable modem satellite bidirectionnel, permettant des appels et des connexions Internet dans les zones sans couverture cellulaire. Une révolution pour les utilisateurs isolés et les professionnels travaillant en zones reculées.</p><p>Tim Cook a présenté cette fonctionnalité comme "la plus grande avancée de connectivité depuis l'introduction du réseau 4G". En partenariat avec le réseau Starlink d'Elon Musk, Apple garantit une couverture sur 98% de la surface terrestre, y compris en haute mer et dans les zones montagneuses.</p><p>Au prix de 1 299 euros pour le modèle d'entrée de gamme, l'iPhone 18 reste dans la lignée tarifaire de ses prédécesseurs. Les précommandes ont battu tous les records, avec plus de 5 millions d'unités réservées en 24 heures en France.</p>`,
    rubrique: "Sciences",
    author: "David Chen",
    tags: JSON.stringify(["apple", "iphone", "technologie", "satellite"]),
    isPremium: false,
  },
  {
    title: "Football féminin : l'OL Féminin remporte une sixième Ligue des champions",
    excerpt: "Les Lyonnaises ont dominé le FC Barcelone en finale (3-1) pour décrocher un sixième titre européen, confirmant leur statut de meilleur club féminin de la planète.",
    content: `<p>Les Lyonnaises ont dominé le FC Barcelone en finale (3-1) pour décrocher un sixième titre européen, confirmant leur statut de meilleur club féminin de la planète. La finale, disputée devant 60 000 spectateurs au stade de Wembley, a été à la hauteur de son affiche.</p><p>La star lyonnaise Amandine Henry, de retour après une grave blessure, a inscrit un doublé au cours de la première heure de jeu avant de laisser sa place. La Ballon d'Or en titre Alexia Putellas, capitaine barcelonaise, n'a pas réussi à inverser la tendance malgré une belle réduction du score en fin de match.</p><p>La joueuse française Delphine Cascarino a été élue meilleure joueuse du match pour sa performance technique et ses deux passes décisives. L'OL féminin confirme qu'aucune équipe en Europe ne lui dispute sérieusement la suprématie sur le continent.</p>`,
    rubrique: "Sport",
    author: "Sarah Bonnard",
    tags: JSON.stringify(["football féminin", "OL", "ligue des champions", "lyon"]),
    isPremium: false,
  },
  {
    title: "Crise sanitaire : recrudescence de la rougeole inquiète les autorités",
    excerpt: "La France enregistre une hausse de 340% des cas de rougeole en un an, liée à une baisse du taux de vaccination chez les enfants de moins de 5 ans.",
    content: `<p>La France enregistre une hausse de 340% des cas de rougeole en un an, liée à une baisse du taux de vaccination chez les enfants de moins de 5 ans. Santé publique France a déclenché une alerte nationale et appelle les parents à vérifier le carnet de santé de leurs enfants.</p><p>Le phénomène, observé dans l'ensemble des régions, est particulièrement prononcé en Île-de-France, Auvergne-Rhône-Alpes et Provence-Alpes-Côte d'Azur. Les épidémiologistes l'expliquent par la désorganisation des parcours de soins pendant le Covid, qui a conduit de nombreuses familles à repousser puis oublier certains rappels vaccinaux.</p><p>Le ministère de la Santé a lancé une campagne de rattrapage vaccinal ciblant spécifiquement les enfants nés entre 2021 et 2024. La rougeole, pourtant évitable par deux doses de vaccin, peut entraîner des complications graves, notamment des encéphalites, dans 1 à 2 cas pour mille.</p>`,
    rubrique: "Société",
    author: "Docteur Laure Petit",
    tags: JSON.stringify(["santé", "rougeole", "vaccination", "épidémie"]),
    isPremium: false,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Users
  const hashedPassword = await bcrypt.hash("password123", 12);
  const adminPassword = await bcrypt.hash("admin2026!", 12);

  await prisma.user.upsert({
    where: { email: "admin@monde-clone.fr" },
    update: {},
    create: {
      email: "admin@monde-clone.fr",
      name: "Administrateur",
      password: adminPassword,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "abonne@exemple.fr" },
    update: {},
    create: {
      email: "abonne@exemple.fr",
      name: "Jean Abonné",
      password: hashedPassword,
      role: "subscriber",
    },
  });

  await prisma.user.upsert({
    where: { email: "lecteur@exemple.fr" },
    update: {},
    create: {
      email: "lecteur@exemple.fr",
      name: "Marie Lectrice",
      password: hashedPassword,
      role: "user",
    },
  });

  console.log("✅ Users created");

  // Articles
  const slugify_fn = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  for (const article of articles) {
    const slug = slugify_fn(article.title);
    const publishedAt = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    );

    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        ...article,
        slug,
        publishedAt,
        articleType: article.articleType ?? "Article",
        imageCredit: (article as { imageCredit?: string }).imageCredit ?? null,
        viewCount: Math.floor(Math.random() * 500),
      },
    });
  }

  console.log(`✅ ${articles.length} articles created`);

  // Newsletter subscriptions
  const newsletterEmails = [
    "sophie.martin@gmail.com",
    "pierre.durand@outlook.fr",
    "marie.bernard@yahoo.fr",
    "jean.dupont@free.fr",
    "isabelle.moreau@gmail.com",
  ];

  for (const email of newsletterEmails) {
    await prisma.newsletterSubscription.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  }

  console.log("✅ Newsletter subscriptions created");
  console.log("🎉 Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
