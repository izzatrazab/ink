/**
 * The single PDF→Response seam: turn a finished drill document into an HTTP
 * Response. Attaches a data listener, ends the document, waits for it to flush,
 * and returns the bytes inline (so the PDF opens in a new tab).
 *
 * Both the DrillBase drills (via DrillBase.response) and the standalone drills
 * (ColumnMethod, LongDivisionMethod, straight from their routes) go through here,
 * so buffering and the end-promise live in one place.
 */
export async function pdfResponse(doc: PDFKit.PDFDocument, fileName: string): Promise<Response> {
	const buffers: any[] = [];
	doc.on('data', (chunk) => buffers.push(chunk));

	// PDFKit flushes its pages when the document is ended; collect them, then respond.
	await new Promise((resolve) => {
		doc.on('end', resolve);
		doc.end();
	});

	return new Response(Buffer.concat(buffers), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline; filename="' + fileName + '"' // open in new tab
			// 'Content-Disposition': 'attachment' // direct download
		}
	});
}
