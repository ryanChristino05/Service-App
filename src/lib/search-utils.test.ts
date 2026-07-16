import test from 'node:test';
import assert from 'node:assert/strict';
import { buildServiceSearchWhere } from './search-utils';

test('buildServiceSearchWhere includes query filters and category filter', () => {
  const where = buildServiceSearchWhere({ query: 'plombier', categorieId: 2 });

  assert.equal(where.categorie_id, 2);
  assert.equal(where.statut, 'VALIDE');
  assert.ok(Array.isArray(where.OR));
  assert.equal(where.OR.length, 5);
});

test('buildServiceSearchWhere returns a simple filter when query is empty', () => {
  const where = buildServiceSearchWhere({ query: '   ', categorieId: undefined });

  assert.equal(where.statut, 'VALIDE');
  assert.equal(where.categorie_id, undefined);
  assert.equal(where.OR, undefined);
});
