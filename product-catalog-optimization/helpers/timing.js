/* Fonction asynchrone permettant de mesurer le temps d'exécution d'une fonction.*/
async function timing(label, callable) {
  // Début de la mesure du temps
  console.time(`INFO: ${label}`);
  try {
    // Exécution de la fonction asynchrone
    return await callable();
  } finally {
    // Fin de la mesure du temps et affichage du résultat
    console.timeEnd(`INFO: ${label}`);
  }
}

// Exporte la fonction timing pour une utilisation externe
module.exports = {
  timing,
};