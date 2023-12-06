// Importation des modules nécessaires.
const fs = require('fs');
const uuidv4 = require('uuid').v4;
const { MongoClient } = require('mongodb');
const minimist = require('minimist');

// Importation des fonctions utilitaires depuis les fichiers d'aide.
const { timing } = require('./helpers/timing');
const { memory } = require('./helpers/memory');
const { Metrics } = require('./helpers/metrics');
const { Product } = require('./product');

// Nom de la base de données MongoDB et URL de connexion.
const DATABASE_NAME = 'test-product-catalog';
const MONGO_URL = `mongodb://0.0.0.0:27017/${DATABASE_NAME}`;
const catalogUpdateFile = 'updated-catalog.csv';

// Récupération de la taille depuis les arguments de la ligne de commande.
const { size } = minimist(process.argv.slice(2));
if (!size) {
  throw new Error("Missing 'size' parameter");
}

// Fonction principale du script.
async function main() {
  // Connexion à la base de données MongoDB.
  const mongoClient = new MongoClient(MONGO_URL);
  const connection = await mongoClient.connect();
  const db = connection.db();

  // Pour exécuter le script plusieurs fois sans nettoyer manuellement les données.
  await clearExistingData(db);

  // Génération du jeu de données en utilisant la mémoire et le chronométrage.
  await memory(
    'Generate dataset',
    () => timing(
      'Generate dataset',
      () => generateDataset(db, size)
    )
  );
}

// Fonction pour effacer les données existantes dans la base de données et le fichier CSV.
async function clearExistingData(db) {
  // Récupération de la liste des bases de données.
  const listDatabaseResult = await db.admin().listDatabases({ nameOnly: 1 });

  // Suppression de la base de données si elle existe.
  if (listDatabaseResult.databases.find(d => d.name === DATABASE_NAME)) {
    await db.dropDatabase();
  }

  // Suppression du fichier CSV s'il existe.
  if (fs.existsSync(catalogUpdateFile)) {
    fs.rmSync(catalogUpdateFile);
  }
}

// Fonction pour générer le jeu de données.
async function generateDataset(db, catalogSize) {
  // Écriture des en-têtes CSV.
  writeCsvHeaders();

  // Initialisation des métriques.
  const metrics = Metrics.zero();
  const createdAt = new Date();

  // Utilisation d'un tableau pour stocker les produits.
  const products = [];

  // Génération de produits.
  for (let i = 0; i < catalogSize; i++) {
    const product = generateProduct(i, createdAt);
    products.push(product);

    // Affichage du pourcentage de progression.
    const progressPercentage = (i + 1) * 100 / catalogSize;
    if (progressPercentage % 10 === 0) {
      console.debug(`[DEBUG] Processing ${progressPercentage}%...`);
    }
  }

  // Insertion de tous les produits en une seule opération.
  await db.collection('Products').insertMany(products);

  // Traitement de chaque produit après l'insertion.
  for (let i = 0; i < catalogSize; i++) {
    const product = products[i];
    const updatedProduct = generateUpdate(product, i, catalogSize);
    metrics.merge(writeProductUpdateToCsv(product, updatedProduct));
  }

  // Affichage des métriques.
  logMetrics(catalogSize, metrics);
}

// Fonction pour écrire les en-têtes CSV.
function writeCsvHeaders() {
  fs.appendFileSync(catalogUpdateFile, Object.keys(generateProduct(-1, null)).join(',') + '\n');
}

// Fonction pour générer un produit.
function generateProduct(index, createdAt) {
  return new Product(uuidv4(), `Product_${index}`, generatePrice(), createdAt, createdAt);
}

// Fonction pour générer un prix aléatoire.
function generatePrice() {
  return Math.round(Math.random() * 1000 * 100) / 100;
}

// Probabilités d'événements liés aux produits.
const productEvent = {
  pDelete: 10, // Probabilité de supprimer le produit.
  pUpdate: 10, // Probabilité de mettre à jour le produit.
  pAdd: 20,    // Probabilité d'ajouter un nouveau produit.
};

// Fonction pour générer une mise à jour de produit.
function generateUpdate(product, index, catalogSize) {
  const rand = Math.random() * 100; // Valeur aléatoire dans [0; 100].
  if (rand < productEvent.pDelete) {
    // Supprimer le produit.
    return null;
  }
  if (rand < productEvent.pDelete + productEvent.pUpdate) {
    // Mettre à jour le produit.
    return new Product(product._id, `Product_${index + catalogSize}`, generatePrice(), product.createdAt, new Date());
  }
  if (rand < productEvent.pDelete + productEvent.pUpdate + productEvent.pAdd) {
    // Ajouter un nouveau produit.
    return generateProduct(index + catalogSize, new Date());
  }

  // Produit inchangé.
  return product;
}

// Fonction pour écrire la mise à jour du produit dans le fichier CSV.
function writeProductUpdateToCsv(product, updatedProduct) {
  if (updatedProduct) {
    if (updatedProduct._id === product._id) {
      // Produit mis à jour ou aucune modification => ajouter cette ligne.
      fs.appendFileSync(catalogUpdateFile, updatedProduct.toCsv() + '\n');
      return updatedProduct.updatedAt !== updatedProduct.createdAt ? Metrics.updated() : Metrics.zero();
    } else {
      // Conserver le produit.
      fs.appendFileSync(catalogUpdateFile, product.toCsv() + '\n');
      // Ajouter le nouveau produit.
      fs.appendFileSync(catalogUpdateFile, updatedProduct.toCsv() + '\n');
      return Metrics.added();
    }
  } else {
    return Metrics.deleted();
  }
}

// Fonction pour afficher les métriques.
function logMetrics(catalogSize, metrics) {
  console.info(`[INFO] ${catalogSize} products inserted in DB.`);
  console.info(`[INFO] ${metrics.addedCount} products to be added.`);
  console.info(`[INFO] ${metrics.updatedCount} products to be updated ${(metrics.updatedCount * 100 / catalogSize).toFixed(2)}%.`);
  console.info(`[INFO] ${metrics.deletedCount} products to be deleted ${(metrics.deletedCount * 100 / catalogSize).toFixed(2)}%.`);
}

// Exécution de la fonction principale si le script est exécuté en tant que programme principal.
if (require.main === module) {
  main()
    .then(() => {
      console.log('SUCCESS');
      process.exit(0);
    })
    .catch(err => {
      console.log('FAIL');
      console.error(err);
      process.exit(1);
    });
}
