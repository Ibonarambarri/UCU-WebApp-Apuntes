// Tests propios (el ejercicio original no traía tests).
import assert from 'node:assert';
import { genExp, evalExp } from './ej02.js';

console.log('Ejecutando tests para genExp...');

for (const target of [0, 1, 2, 5, 6, 7, 11, 24, 100]) {
  const vistos = new Set();
  for (let i = 0; i < 200; i += 1) {
    const exp = genExp(target);
    assert.ok(['+', '-', '*', '/'].includes(exp.operator), 'operador válido');
    assert.equal(Number.isInteger(exp.left), true, 'left entero');
    assert.equal(Number.isInteger(exp.right), true, 'right entero');
    assert.equal(evalExp(exp), target, `${exp.left} ${exp.operator} ${exp.right} debe dar ${target}`);
    vistos.add(exp.operator);
  }
  console.log(`  ${target}: operadores generados -> ${[...vistos].sort().join(' ')}`);
}

assert.throws(() => genExp('x'), 'debe fallar con un argumento no entero');

console.log('Tests para genExp finalizados correctamente.');
