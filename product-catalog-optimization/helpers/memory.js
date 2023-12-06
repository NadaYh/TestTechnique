const _ = require('lodash');

const { prettyBytes } = require('./pretty-bytes');

// Fonction asynchrone pour mesurer la consommation mémoire d'une fonction donnée
async function memory(label, callable) {
  // Mesurer les métriques initiales de la mémoire
  const initialMemoryMetrics = memUsage();
  try {
    // Exécuter la fonction passée en paramètre
    return await callable();
  } finally {
    // Mesurer les métriques finales de la mémoire
    const finalMemoryMetrics = memUsage();
    // Calculer le delta de consommation mémoire
    const delta = calculateMemoryDelta(initialMemoryMetrics, finalMemoryMetrics);

    // Afficher le delta formaté dans la console
    console.debug(
      `DEBUG: ${label} - delta memory metrics:`,
      { ..._.mapValues(delta, prettyBytes) },
    );
  }
}

// Fonction utilitaire pour mesurer les métriques de la mémoire
function memUsage() {
  const metrics = process.memoryUsage();
  // Mettre à jour les statistiques de consommation mémoire
  updateMemoryStatistics(metrics);
  return metrics;
}

// Statistiques de consommation mémoire
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

// Fonction utilitaire pour mettre à jour les statistiques de consommation mémoire
function updateMemoryStatistics(metrics) {
  stats.max.rss = Math.max(stats.max.rss, metrics.rss);
  stats.max.heapTotal = Math.max(stats.max.heapTotal, metrics.heapTotal);
  stats.max.heapUsed = Math.max(stats.max.heapUsed, metrics.heapUsed);
  stats.max.external = Math.max(stats.max.external, metrics.external);
  stats.max.arrayBuffers = Math.max(stats.max.arrayBuffers, metrics.arrayBuffers);

  stats.sum.rss += metrics.rss;
  stats.sum.heapTotal += metrics.heapTotal;
  stats.sum.heapUsed += metrics.heapUsed;
  stats.sum.external += metrics.external;
  stats.sum.arrayBuffers += metrics.arrayBuffers;

  stats.count += 1;
}

// Fonction utilitaire pour calculer le delta de consommation mémoire
function calculateMemoryDelta(initialMetrics, finalMetrics) {
  return {
    rss: finalMetrics.rss - initialMetrics.rss,
    heapTotal: finalMetrics.heapTotal - initialMetrics.heapTotal,
    heapUsed: finalMetrics.heapUsed - initialMetrics.heapUsed,
    external: finalMetrics.external - initialMetrics.external,
    arrayBuffers: finalMetrics.arrayBuffers - initialMetrics.arrayBuffers,
  };
}

// Fonction pour obtenir les statistiques de consommation mémoire
function getMemoryStatistics() {
  return {
    max: { ..._.mapValues(stats.max, prettyBytes) },
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

// Exporter les fonctions pour une utilisation externe
module.exports = {
  memory,
  getMemoryStatistics,
};
