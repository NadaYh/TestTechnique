// Implement fizzbuzz logic
function fizzbuzz(number) {
  if (number % 3 === 0 && number % 5 === 0) {
    return 'fizzbuzz';
  } else if (number % 3 === 0) {
    return 'fizz';
  } else if (number % 5 === 0) {
    return 'buzz';
  } else {
    return number.toString();
  }
}

// Implement the wrapper
function main() {
  // Get the command line argument (n)
  const n = process.argv[2];

  // Validate if n is provided and is a positive integer
  if (!n || isNaN(n) || n <= 0 || !Number.isInteger(Number(n))) {
    console.log("Please provide a valid positive integer as 'n'.");
  } else {
    for (let i = 1; i <= Number(n); i++) {
      console.log(fizzbuzz(i));
    }
  }
}

main();
