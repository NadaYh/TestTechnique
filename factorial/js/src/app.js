// app.js

function factorial(number) {
  if (number === 0 || number === 1) {
    return 1;
  } else {
    return number * factorial(number - 1);
  }
}

function main() {
  for (let i = 0; i <= 15; i++) {
    console.log(factorial(i));
  }
}

main();
