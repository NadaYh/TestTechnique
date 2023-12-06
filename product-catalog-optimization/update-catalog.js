// Importation des modules nécessaires.
const fs = require('fs');
const { MongoClient } = require('mongodb');
const Promise = require('bluebird');

// Importation des fonctions utilitaires depuis les fichiers d'aide.
const { memory } = require('./helpers/memory');
const { timing } = require('./helpers/timing');
const { Metrics } = require('./helpers/metrics');
const { Product } = require('./product');

// URL de la base de données MongoDB et nom du fichier CSV.
const MONGO_URL = 'mongodb://localhost:27017/test-product-catalog';
const catalogUpdateFile = 'updated-catalog.csv';

// Fonction principale du script.
async function main() {
  // Connexion à la base de données MongoDB.
  const mongoClient = new MongoClient(MONGO_URL);
  const connection = await mongoClient.connect();
  const db = connection.db();

  // Mise à jour du dataset en utilisant la mémoire et la synchronisation du temps.
  await memory(
    'Update dataset',
    () => timing(
      'Update dataset',
      () => updateDataset(db)
    )
  );
}

// Fonction pour mettre à jour le dataset dans la base de données.
async function updateDataset(db) {
  // Lecture du contenu du fichier CSV.
  const csvContent = fs.readFileSync(catalogUpdateFile, 'utf-8');
  const rowsWithHeader = csvContent.split('\n');
  const dataRows = rowsWithHeader.slice(1); // Ignorer les en-têtes CSV.

  // Initialisation des métriques pour suivre les modifications.
  const metrics = Metrics.zero();

  // Fonction pour mettre à jour les métriques en fonction des résultats de la mise à jour.
  function updateMetrics(updateResult) {
    if (updateResult.modifiedCount) {
      metrics.updatedCount += 1;
    }
    if (updateResult.upsertedCount) {
      metrics.addedCount += 1;
    }
  }

  // Calcul de la taille actuelle du catalogue dans la base de données MongoDB.
  const dbCatalogSize = await db.collection('Products').count();

  // Fonction pour afficher les progrès lors du traitement des lignes CSV.
  const closestPowOf10 = 10 ** (Math.ceil(Math.log10(dbCatalogSize)));
  function logProgress(nbCsvRows) {
    const progressIndicator = (nbCsvRows * 100) / closestPowOf10;
    if (progressIndicator % 10 === 0) {
      console.debug(`[DEBUG] Processed ${nbCsvRows} rows...`);
    }
  }

  // Conversion des lignes CSV en objets Product.
  const products = dataRows.filter(dataRow => dataRow).map(row => Product.fromCsv(row));

  // Préparation des opérations en masse pour la mise à jour de la base de données.
  const bulkOperations = products.map((product) => ({
    updateOne: {
      filter: { _id: product._id },
      update: { $set: product },
      upsert: true,
    },
  }));

  // Exécution des opérations en masse.
  const bulkResult = await db.collection('Products').bulkWrite(bulkOperations);
  updateMetrics(bulkResult);

  // Récupération des identifiants des produits dans la base de données.
  const dbIds = (await db.collection('Products').find({}, { _id: 1 }).toArray()).map(o => o._id);

  // Fonction pour vérifier si un identifiant de produit a été supprimé du fichier CSV.
  const isDeletedId = id => !products.find(p => p._id === id);
  const deletedProductIds = dbIds.filter(id => isDeletedId(id));

  // Suppression des produits dont les identifiants ne figurent pas dans le fichier CSV.
  for (const pId of deletedProductIds) {
    const deleteResult = await db.collection('Products').deleteOne({ _id: pId });
    if (deleteResult.deletedCount) {
      metrics.deletedCount += 1;
    }
  }

  // Affichage des métriques.
  logMetrics(dataRows.length - 1, metrics); // dataRows.length - 1 car il y a une nouvelle ligne à la fin du fichier.
}

// Fonction pour afficher les métriques.
function logMetrics(numberOfProcessedRows, metrics) {
  console.info(`[INFO] Processed ${numberOfProcessedRows} CSV rows.`);
  console.info(`[INFO] Added ${metrics.addedCount} new products.`);
  console.info(`[INFO] Updated ${metrics.updatedCount} existing products.`);
  console.info(`[INFO] Deleted ${metrics.deletedCount} products.`);
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
