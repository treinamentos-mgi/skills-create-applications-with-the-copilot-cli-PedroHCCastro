#!/usr/bin/env node
/**
 * Calculadora CLI
 *
 * Uso: node src/calculator.js <operação> <a> <b>
 *
 * Operações suportadas:
 *   add       - Adição (addition) (a + b)
 *   subtract  - Subtração (subtraction) (a - b)
 *   multiply  - Multiplicação (multiplication) (a * b)
 *   divide    - Divisão (division) (a / b); divisão por zero gera erro
 *
 * Exemplos:
 *   node src/calculator.js add 2 3      # 5
 *   node src/calculator.js divide 10 2  # 5
 */

// Adição (addition)
function add(a, b) {
  return a + b;
}

// Subtração (subtraction)
function subtract(a, b) {
  return a - b;
}

// Multiplicação (multiplication)
function multiply(a, b) {
  return a * b;
}

// Divisão (division) (erro em caso de divisor zero)
function divide(a, b) {
  if (b === 0) {
    throw new Error('Divisão por zero não é permitida.');
  }
  return a / b;
}

const operations = { add, subtract, multiply, divide };

function main(args) {
  const [operation, rawA, rawB] = args;

  if (args.length !== 3 || !Object.hasOwn(operations, operation)) {
    console.error('Uso: node calculator.js <add|subtract|multiply|divide> <a> <b>');
    return 1;
  }

  const a = Number(rawA);
  const b = Number(rawB);
  if (rawA.trim() === '' || rawB.trim() === '' || !Number.isFinite(a) || !Number.isFinite(b)) {
    console.error('Erro: os operandos devem ser números válidos.');
    return 1;
  }

  try {
    console.log(operations[operation](a, b));
    return 0;
  } catch (err) {
    console.error(`Erro: ${err.message}`);
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { add, subtract, multiply, divide };
