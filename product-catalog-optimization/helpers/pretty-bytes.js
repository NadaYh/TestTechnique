// Importer la fonction isNumber depuis la bibliothèque lodash
const { isNumber } = require('lodash');

// Définir la classe Unit pour représenter une unité de mesure
class Unit {
  // Constructeur initialisant le symbole et la valeur de l'unité
  constructor(symbol, value) {
    this.symbol = symbol;
    this.value = value;
  }
}

// Tableau d'unités ordonnées de manière décroissante en termes de valeur
const UNITS_ORDERED_DESC = [
  new Unit('PB', 1024 * 1024 * 1024 * 1024 * 1024),
  new Unit('TB', 1024 * 1024 * 1024 * 1024),
  new Unit('GB', 1024 * 1024 * 1024),
  new Unit('MB', 1024 * 1024),
  new Unit('KB', 1024),
  new Unit('B', 1),
];

/**
 * Fonction pour arrondir un nombre à deux décimales
 * @param {Number} x: la valeur à arrondir
 * @returns La valeur arrondie à 2 décimales
 */
function round(x) {
  return Math.round(x * 100) / 100;
}

/**
 * Fonction pour formater une taille en octets de manière lisible
 * @param {Number} bytes: Le nombre d'octets à formater
 * @returns Une chaîne de caractères représentant la taille lisible
 * @throws {TypeError} Si l'entrée n'est pas numérique
 */
function prettyBytes(bytes) {
  // Vérifier si l'entrée est un nombre, sinon, lancer une erreur de type
  if (!isNumber(bytes)) {
    throw new TypeError('La fonction prettyBytes ne prend en charge que les entrées numériques.');
  }

  // Arrondir le nombre à deux décimales
  const rounded = round(bytes);

  // Retourner '0B' si la valeur arrondie est proche de zéro
  if (Math.abs(rounded) < Number.EPSILON) {
    return '0B';
  }

  // Parcourir les unités de manière décroissante et sélectionner la première unité applicable
  for (const unit of UNITS_ORDERED_DESC) {
    const quotient = bytes / unit.value;
    if (Math.abs(quotient) >= 1) {
      return `${round(quotient)}${unit.symbol}`;
    }
  }

  // Retourner la taille en octets si aucune unité n'est applicable
  return `${bytes}B`;
}

// Exporter la fonction prettyBytes pour une utilisation externe
module.exports = {
  prettyBytes,
};
