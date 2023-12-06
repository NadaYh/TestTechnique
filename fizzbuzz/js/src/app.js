// Implémenter la logique de FizzBuzz
function fizzbuzz(nombre) {
  // Vérifier si le nombre est divisible par 3 et 5
  if (nombre % 3 === 0 && nombre % 5 === 0) {
    return 'fizzbuzz';
  } else if (nombre % 3 === 0) {
    // Vérifier si le nombre est divisible par 3
    return 'fizz';
  } else if (nombre % 5 === 0) {
    // Vérifier si le nombre est divisible par 5
    return 'buzz';
  } else {
    // Si le nombre n'est divisible ni par 3 ni par 5, retourner le nombre sous forme de chaîne de caractères
    return nombre.toString();
  }
}

// Implémenter le programme principal
function main() {
  // Récupérer l'argument de la ligne de commande (n)
  const n = process.argv[2];

  // Valider si n est fourni et est un entier positif
  if (!n || isNaN(n) || n <= 0 || !Number.isInteger(Number(n))) {
    // Afficher un message d'erreur si n n'est pas valide
    console.log("Veuillez fournir un entier positif valide en tant que 'n'.");
  } else {
    // Itérer de 1 à n et afficher le résultat de la fonction fizzbuzz pour chaque nombre
    for (let i = 1; i <= Number(n); i++) {
      console.log(fizzbuzz(i));
    }
  }
}

// Appeler la fonction principale pour exécuter la logique de FizzBuzz
main();
