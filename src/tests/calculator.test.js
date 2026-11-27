const { spawnSync } = require('child_process');
const path = require('path');
const { add, subtract, multiply, divide, modulo, power, squareRoot } = require('../calculator');

describe('addition', () => {
  test('2 + 3 = 5', () => expect(add(2, 3)).toBe(5));
  test('números negativos', () => expect(add(-2, -3)).toBe(-5));
  test('positivo + negativo', () => expect(add(5, -8)).toBe(-3));
  test('zero é elemento neutro', () => expect(add(7, 0)).toBe(7));
  test('decimais', () => expect(add(0.5, 0.25)).toBeCloseTo(0.75));
  test('0.1 + 0.2 ≈ 0.3', () => expect(add(0.1, 0.2)).toBeCloseTo(0.3));
});

describe('subtraction', () => {
  test('10 - 4 = 6', () => expect(subtract(10, 4)).toBe(6));
  test('resultado negativo', () => expect(subtract(4, 10)).toBe(-6));
  test('subtrair negativo', () => expect(subtract(5, -3)).toBe(8));
  test('subtrair zero', () => expect(subtract(9, 0)).toBe(9));
  test('x - x = 0', () => expect(subtract(3.5, 3.5)).toBe(0));
});

describe('multiplication', () => {
  test('45 * 2 = 90', () => expect(multiply(45, 2)).toBe(90));
  test('por zero', () => expect(multiply(123, 0)).toBe(0));
  test('por um', () => expect(multiply(8, 1)).toBe(8));
  test('sinais diferentes', () => expect(multiply(-4, 3)).toBe(-12));
  test('dois negativos', () => expect(multiply(-4, -3)).toBe(12));
  test('decimais', () => expect(multiply(1.5, 2)).toBe(3));
});

describe('division', () => {
  test('20 / 5 = 4', () => expect(divide(20, 5)).toBe(4));
  test('resultado decimal', () => expect(divide(1, 4)).toBe(0.25));
  test('sinais diferentes', () => expect(divide(-10, 2)).toBe(-5));
  test('dois negativos', () => expect(divide(-10, -2)).toBe(5));
  test('zero dividido por número', () => expect(divide(0, 5)).toBe(0));
  test('divisão por zero lança erro', () => {
    expect(() => divide(10, 0)).toThrow('Divisão por zero');
  });
  test('0 / 0 lança erro', () => {
    expect(() => divide(0, 0)).toThrow('Divisão por zero');
  });
});

describe('modulo', () => {
  test('resto da divisão', () => expect(modulo(10, 3)).toBe(1));
  test('dividendo negativo', () => expect(modulo(-10, 3)).toBe(-1));
  test('divisor zero lança erro', () => expect(() => modulo(10, 0)).toThrow('Módulo por zero'));
});

describe('power', () => {
  test('potência inteira', () => expect(power(2, 3)).toBe(8));
  test('expoente negativo', () => expect(power(2, -2)).toBe(0.25));
  test('base negativa com expoente fracionário lança erro', () => {
    expect(() => power(-1, 0.5)).toThrow('Potência');
  });
  test('resultado infinito lança erro', () => expect(() => power(0, -1)).toThrow('Potência'));
});

describe('square root', () => {
  test('raiz quadrada', () => expect(squareRoot(9)).toBe(3));
  test('raiz de zero', () => expect(squareRoot(0)).toBe(0));
  test('número negativo lança erro', () => expect(() => squareRoot(-1)).toThrow('Raiz quadrada'));
});

describe('CLI', () => {
  const script = path.join(__dirname, '..', 'calculator.js');
  const run = (...args) => spawnSync('node', [script, ...args], { encoding: 'utf8' });

  test.each([
    [['add', '2', '3'], '5'],
    [['subtract', '10', '4'], '6'],
    [['multiply', '45', '2'], '90'],
    [['divide', '20', '5'], '4'],
    [['modulo', '10', '3'], '1'],
    [['power', '2', '3'], '8'],
    [['squareRoot', '9'], '3'],
  ])('%j imprime %s', (args, expected) => {
    const r = run(...args);
    expect(r.status).toBe(0);
    expect(r.stdout.trim()).toBe(expected);
  });

  test('divisão por zero retorna erro', () => {
    const r = run('divide', '1', '0');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Divisão por zero');
  });

  test.each([
    [['modulo', '1', '0'], 'Módulo por zero'],
    [['power', '-1', '0.5'], 'Potência'],
    [['squareRoot', '-1'], 'Raiz quadrada'],
  ])('%j retorna erro', (args, message) => {
    const r = run(...args);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain(message);
  });

  test('operando inválido retorna erro', () => {
    const r = run('add', 'a', '1');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('números válidos');
  });

  test('operação desconhecida retorna uso', () => {
    const r = run('toString', '1', '2');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Uso:');
  });

  test('número de argumentos incorreto retorna uso', () => {
    expect(run('add', '1').status).toBe(1);
    expect(run('squareRoot').status).toBe(1);
    expect(run('squareRoot', '9', '2').status).toBe(1);
    expect(run('power', '2').status).toBe(1);
  });

  test('operando inválido da raiz quadrada retorna erro', () => {
    const r = run('squareRoot', ' ');
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('números válidos');
  });
});
