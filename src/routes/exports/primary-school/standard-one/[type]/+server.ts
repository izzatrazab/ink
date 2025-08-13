import { StandardOneAddition } from '$lib/server/exports/standard-1/StandardOne';
// import { pdfResponse } from '$lib/utils/pdfResponse';

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, params }) => {
    
    const number_of_pages = Number(url.searchParams.get('nop') || 1);
    const fileName = `Standard 1 Addition - ${number_of_pages} pg.pdf`

    let doc;
    
    switch (params.type) {
        default:
        case 'addition':
            doc = new StandardOneAddition(number_of_pages);
            break;
    }



    let buffers: any[] = [];

    // Collect data as the PDF is being generated
    doc.on('data', (chunk) => buffers.push(chunk));

    // Return a promise that resolves when the PDF is fully generated
    await new Promise((resolve) => {
        doc.on('end', resolve);
        doc.end();
    });

    
    // return pdfResponse(buffers, fileName);
    

    const pdfData = Buffer.concat(buffers);

	// Return the PDF as a response
	return new Response(pdfData, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'inline ; filename="' + fileName + '"' // open in new tab
			// 'Content-Disposition': 'attachment' // direct download
		}
	});
};
