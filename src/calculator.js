#!/usr/bin/env node
/**
 * Calculadora CLI
 *
 * Uso: node src/calculator.js <operação> <a> [b]
 *
 * Operações suportadas:
 *   add       - Adição (addition) (a + b)
 *   subtract  - Subtração (subtraction) (a - b)
 *   multiply  - Multiplicação (multiplication) (a * b)
 *   divide    - Divisão (division) (a / b); divisão por zero gera erro
 *   modulo    - Resto da divisão (a % b); divisor zero gera erro
 *   exponentiation - Potenciação (a ** b); resultado não finito ou não real gera erro
 *   squareRoot - Raiz quadrada de a; número negativo gera erro
 *
 * Exemplos:
 *   node src/calculator.js add 2 3      # 5
 *   node src/calculator.js divide 10 2  # 5
 *   node src/calculator.js squareRoot 9 # 3
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

function modulo(a, b) {
  if (b === 0) {
    throw new Error('Módulo por zero não é permitido.');
  }
  return a % b;
}

function exponentiation(a, b) {
  const result = a ** b;
  if (!Number.isFinite(result)) {
    throw new Error('A potência não possui resultado real finito.');
  }
  return result;
}

function squareRoot(a) {
  if (a < 0) {
    throw new Error('Raiz quadrada de número negativo não é permitida.');
  }
  return Math.sqrt(a);
}

const operations = { add, subtract, multiply, divide, modulo, exponentiation, squareRoot };

function main(args) {
  const [operation, rawA, rawB] = args;

  if (!Object.hasOwn(operations, operation) || args.length !== (operation === 'squareRoot' ? 2 : 3)) {
    console.error('Uso: node calculator.js <add|subtract|multiply|divide|modulo|exponentiation> <a> <b> ou squareRoot <a>');
    return 1;
  }

  const a = Number(rawA);
  const b = operation === 'squareRoot' ? undefined : Number(rawB);
  if (rawA.trim() === '' || !Number.isFinite(a) ||
      (operation !== 'squareRoot' && (rawB.trim() === '' || !Number.isFinite(b)))) {
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

module.exports = { add, subtract, multiply, divide, modulo, exponentiation, squareRoot };
