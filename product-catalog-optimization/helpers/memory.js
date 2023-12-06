const _ = require('lodash');

// Importation de la fonction prettyBytes depuis le fichier pretty-bytes.js
const { prettyBytes } = require('./pretty-bytes');

// Fonction asynchrone pour surveiller la consommation de mémoire pendant l'exécution d'une fonction callable
async function memory(label, callable) {
  // Mesure des métriques de mémoire avant l'exécution de la fonction
  const initialMemoryMetrics = memUsage();
  
  try {
    // Exécution de la fonction callable
    return await callable();
  } finally {
    // Mesure des métriques de mémoire après l'exécution de la fonction
    const finalMemoryMetrics = memUsage();

    // Calcul de la variation des métriques
    const delta = {
      rss: finalMemoryMetrics.rss - initialMemoryMetrics.rss,
      heapTotal: finalMemoryMetrics.heapTotal - initialMemoryMetrics.heapTotal,
      heapUsed: finalMemoryMetrics.heapUsed - initialMemoryMetrics.heapUsed,
      external: finalMemoryMetrics.external - initialMemoryMetrics.external,
      arrayBuffers: finalMemoryMetrics.arrayBuffers - initialMemoryMetrics.arrayBuffers,
    };

    // Affichage des variations des métriques en tant que messages de débogage
    console.debug(
      `DEBUG: ${label} - delta memory metrics:`,
      _.mapValues(delta, prettyBytes),
    );
  }
}

// Fonction pour obtenir les métriques de mémoire actuelles
function memUsage() {
  // Obtention des métriques de mémoire
  const metrics = process.memoryUsage();
  
  // Stockage des métriques dans la structure de données
  pushMemoryUsageDataPoint(metrics);
  
  // Renvoi des métriques
  return metrics;
}

// Structure de données pour stocker les statistiques de mémoire
const stats = {
  max: {
    rss: 0,
    heapTotal: 0,
    heapUsed: 0,
    external: 0,
    arrayBuffers: 0,
  },
  sum: {
    rss: 0,
    heapTotal: 0,
    heapUsed: 0,
    external: 0,
    arrayBuffers: 0,
  },
  count: 0,
};

// Fonction pour mettre à jour les statistiques avec les métriques actuelles
function pushMemoryUsageDataPoint(metrics) {
  // Mise à jour des statistiques avec les métriques actuelles
  stats.max.rss = Math.max(stats.max.rss, metrics.rss);
  stats.max.heapTotal = Math.max(stats.max.heapTotal, metrics.heapTotal);
  stats.max.heapUsed = Math.max(stats.max.heapUsed, metrics.heapUsed);
  stats.max.external = Math.max(stats.max.external, metrics.external);
  stats.max.arrayBuffers = Math.max(stats.max.arrayBuffers, metrics.arrayBuffers);

  stats.sum.rss = stats.sum.rss + metrics.rss;
  stats.sum.heapTotal = stats.sum.heapTotal + metrics.heapTotal;
  stats.sum.heapUsed = stats.sum.heapUsed + metrics.heapUsed;
  stats.sum.external = stats.sum.external + metrics.external;
  stats.sum.arrayBuffers = stats.sum.arrayBuffers + metrics.arrayBuffers;

  stats.count += 1;
}

// Fonction pour obtenir les statistiques de mémoire agrégées
function getMemoryStatistics() {
  return {
    max: _.mapValues(stats.max, prettyBytes),
    datapointCount: stats.count,
    average: {
      rss: prettyBytes(stats.sum.rss / stats.count),
      heapTotal: prettyBytes(stats.sum.heapTotal / stats.count),
      heapUsed: prettyBytes(stats.sum.heapUsed / stats.count),
      external: prettyBytes(stats.sum.external / stats.count),
      arrayBuffers: prettyBytes(stats.sum.arrayBuffers / stats.count),
    },
  };
}

// Exportation des fonctions pour une utilisation externe
module.exports = {
  memory,
  getMemoryStatistics,
};
