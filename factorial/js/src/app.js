// app.js

// Fonction pour calculer le factoriel d'un nombre
function factorial(number) {
  // Cas de base : le factoriel de 0 et 1 est toujours 1
  if (number === 0 || number === 1) {
    return 1;
  } else {
    // Utiliser la récursivité pour calculer le factoriel
    return number * factorial(number - 1);
  }
}

// Fonction principale
function main() {
  // Itérer de 0 à 15 et afficher le résultat du calcul du factoriel pour chaque nombre
  for (let i = 0; i <= 15; i++) {
    console.log(factorial(i));
  }
}

// Appeler la fonction principale pour exécuter le programme
main();
