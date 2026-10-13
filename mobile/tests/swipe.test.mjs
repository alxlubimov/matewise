import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decideSwipe } from '../src/domain/swipe.ts';
test('horizontal swipe right expresses interest, left skips', () => {
  assert.equal(decideSwipe(120, 10, .1, 346), 'interest');
  assert.equal(decideSwipe(-120, 10, -.1, 346), 'skip');
});
test('short drags and vertical scrolling do not make a decision', () => {
  assert.equal(decideSwipe(20, 0, .1, 346), null);
  assert.equal(decideSwipe(130, 160, .8, 346), null);
  assert.equal(decideSwipe(0, 180, 0, 346), null);
});
test('a quick flick requires meaningful horizontal movement in the same direction', () => {
  assert.equal(decideSwipe(40, 4, .8, 346), 'interest');
  assert.equal(decideSwipe(-40, 4, -.8, 346), 'skip');
  assert.equal(decideSwipe(10, 0, 2, 346), null);
  assert.equal(decideSwipe(40, 0, -.8, 346), null);
});
