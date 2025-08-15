export function pdfResponse(buffers: any[], fileName: string) {
	const pdfData = Buffer.concat(buffers);

	// Return the PDF as a response
	return new Response(pdfData, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline ; filename="' + fileName + '"' // open in new tab
			// 'Content-Disposition': 'attachment' // direct download
		}
	});
}
