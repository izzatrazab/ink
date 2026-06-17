import { error } from '@sveltejs/kit';
import type { DrillBase } from './base/DrillBase';
import Standard6Addition from './standard-6/Addition';
import Standard6Subtraction from './standard-6/Subtraction';
import Standard6Multiplication from './standard-6/Multiplication';
import Standard6Division from './standard-6/Division';
import {
	Addition,
	AdditionStandardForm,
	Subtraction,
	SubtractionStandardForm
} from './standard-one/StandardOne';

/**
 * A reachable DrillBase-family Drill: how to build it from a page count, and what
 * to name the Worksheet file it streams. The registry is the one place that
 * answers "which grade Drills are reachable, and by what name" — delete it and
 * that knowledge scatters back across one `+server.ts` per Drill.
 *
 * ColumnMethod and LongDivisionMethod are intentionally absent: they are not
 * DrillBase drills (ADR-0004) and take operation/difficulty/remainder params
 * rather than a bare page count, so they keep their own routes.
 */
export type DrillEntry = {
	/** human label; also the Worksheet filename stem, e.g. "Standard 6 Addition" */
	label: string;
	make: (numberOfPages: number) => DrillBase;
};

export const standard6Drills: Record<string, DrillEntry> = {
	addition: { label: 'Standard 6 Addition', make: (n) => new Standard6Addition(n) },
	subtraction: { label: 'Standard 6 Subtraction', make: (n) => new Standard6Subtraction(n) },
	multiplication: { label: 'Standard 6 Multiplication', make: (n) => new Standard6Multiplication(n) },
	division: { label: 'Standard 6 Division', make: (n) => new Standard6Division(n) }
};

export const standardOneDrills: Record<string, DrillEntry> = {
	addition: { label: 'Standard 1 Addition', make: (n) => new Addition(n) },
	'addition-standard-form': {
		label: 'Standard 1 Addition Standard Form',
		make: (n) => new AdditionStandardForm(n)
	},
	subtraction: { label: 'Standard 1 Subtraction', make: (n) => new Subtraction(n) },
	'subtraction-standard-form': {
		label: 'Standard 1 Subtraction Standard Form',
		make: (n) => new SubtractionStandardForm(n)
	}
};

/**
 * Look up a Drill by slug, build it for the requested page count, and stream its
 * Worksheet. The single dispatch both grade routes share. An unknown slug is a
 * 404; `nop` defaults to 1, matching the old per-route behaviour.
 */
export function drillExport(
	drills: Record<string, DrillEntry>,
	type: string | undefined,
	url: URL
): Promise<Response> {
	const entry = type ? drills[type] : undefined;
	if (!entry) throw error(404, `Unknown drill: ${type}`);

	const numberOfPages = Number(url.searchParams.get('nop') || 1);
	const doc = entry.make(numberOfPages);
	return doc.response(`${entry.label} - ${numberOfPages} pg.pdf`);
}
