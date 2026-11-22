import { describe, expect, it } from 'vitest';
import { nextScore, parseBest, withBest } from './primeBlitz';

describe('nextScore', () => {
	it('adds a point for a find and takes one for a wrong tap, never below 0', () => {
		expect(nextScore(3, 'found')).toBe(4);
		expect(nextScore(3, 'wrong')).toBe(2);
		expect(nextScore(0, 'wrong')).toBe(0);
	});
});

describe('withBest', () => {
	it('records a better score per tier, and leaves a worse one alone', () => {
		expect(withBest({}, 20, 5)).toEqual({ best: { 20: 5 }, isBest: true });
		expect(withBest({ 20: 5 }, 20, 5)).toEqual({ best: { 20: 5 }, isBest: false });
		expect(withBest({ 20: 5 }, 50, 2)).toEqual({ best: { 20: 5, 50: 2 }, isBest: true });
	});
	it('does not call a score of 0 a best', () => {
		expect(withBest({}, 20, 0).isBest).toBe(false);
	});
});

describe('parseBest', () => {
	it('reads saved bests defensively', () => {
		expect(parseBest(null)).toEqual({});
		expect(parseBest('nope')).toEqual({});
		expect(parseBest('{"20":7,"50":-1,"100":"x","9":4}')).toEqual({ 20: 7 });
	});
});
