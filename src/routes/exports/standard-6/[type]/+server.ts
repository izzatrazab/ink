import { standard6Drills, drillExport } from '$lib/server/exports/registry';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url, params }) =>
	drillExport(standard6Drills, params.type, url);
