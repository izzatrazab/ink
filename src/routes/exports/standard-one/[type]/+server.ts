import { standardOneDrills, drillExport } from '$lib/server/exports/registry';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url, params }) =>
	drillExport(standardOneDrills, params.type, url);
