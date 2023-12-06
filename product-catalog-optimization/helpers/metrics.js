// Définition de la classe Metrics pour suivre les métriques d'ajout, de mise à jour et de suppression
class Metrics {
    // Constructeur initialisant les compteurs d'ajout, de mise à jour et de suppression
    constructor(addedCount, updatedCount, deletedCount) {
        this.addedCount = addedCount;
        this.updatedCount = updatedCount;
        this.deletedCount = deletedCount;
    }

    // Méthode statique pour créer une instance Metrics avec un certain nombre d'ajouts
    static added(count = 1) {
        return new Metrics(count, 0, 0);
    }

    // Méthode statique pour créer une instance Metrics avec un certain nombre de mises à jour
    static updated(count = 1) {
        return new Metrics(0, count, 0);
    }

    // Méthode statique pour créer une instance Metrics avec un certain nombre de suppressions
    static deleted(count = 1) {
        return new Metrics(0, 0, count);
    }

    // Méthode statique pour créer une instance Metrics avec tous les compteurs initialisés à zéro
    static zero() {
        return new Metrics(0, 0, 0);
    }

    /**
     * /!\ Implémentation mutable
     * Méthode pour fusionner les métriques d'une autre instance Metrics avec 'this'.
     * @param {Metrics} other: Instance Metrics à fusionner avec 'this'.
     */
    merge(other) {
        // Ajouter les compteurs de l'autre instance Metrics à 'this'
        this.addedCount += other.addedCount;
        this.updatedCount += other.updatedCount;
        this.deletedCount += other.deletedCount;
    }
}

// Exporter la classe Metrics pour une utilisation externe
module.exports = {
    Metrics,
}
