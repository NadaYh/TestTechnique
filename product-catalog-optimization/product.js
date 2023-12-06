// La classe Product représente un produit avec des attributs tels que l'identifiant, le libellé,
// le prix, la date de création et la date de mise à jour.

class Product {
  // Le constructeur initialise les propriétés de l'objet Product avec les valeurs fournies.
  // Les propriétés _id, label, price, createdAt et updatedAt sont accessibles depuis l'extérieur de la classe.

  constructor(id, label, price, createdAt, updatedAt) {
    // Identifiant unique du produit.
    this._id = id;

    // Libellé du produit.
    this.label = label;

    // Prix du produit.
    this.price = price;

    // Date de création du produit.
    this.createdAt = createdAt;

    // Date de mise à jour du produit.
    this.updatedAt = updatedAt;
  }

  // Méthode pour convertir l'objet Product en une chaîne CSV formattée.
  toCsv() {
    return `${this._id},${this.label},${this.price},${this.createdAt.toISOString()},${this.updatedAt.toISOString()}`;
  }

  // Méthode statique pour créer un objet Product à partir d'une ligne CSV.
  static fromCsv(csvLine) {
    // Séparation de la ligne CSV en parties en utilisant la virgule comme délimiteur.
    const parts = csvLine.split(',');

    // Création d'une nouvelle instance de Product avec les valeurs extraites de la ligne CSV.
    return new Product(
      parts[0],                // Identifiant
      parts[1],                // Libellé
      Number(parts[2]),        // Prix (converti en nombre)
      new Date(parts[3]),      // Date de création (convertie en objet Date)
      new Date(parts[4])       // Date de mise à jour (convertie en objet Date)
    );
  }
}

// Exportation de la classe Product pour être utilisée dans d'autres fichiers.
module.exports = {
  Product
};
