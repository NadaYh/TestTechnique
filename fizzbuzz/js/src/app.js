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
  for (let i = 1; i <= 10; i++) {
    console.log(fizzbuzz(i));
  }
}

main();
