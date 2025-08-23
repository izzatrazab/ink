import { Addition, AdditionStandardForm, Subtraction } from '$lib/server/exports/standard-one/StandardOne';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, params }) => {
    
    const number_of_pages = Number(url.searchParams.get('nop') || 1);
    const fileName = `Standard 1 Addition - ${number_of_pages} pg.pdf`

    let doc;
    
    switch (params.type) {
        default:
        case 'addition':
            doc = new Addition(number_of_pages);
            break;
        case 'addition-standard-form':
            doc = new AdditionStandardForm(number_of_pages);
            break;
        case 'subtraction':
            doc = new Subtraction(number_of_pages);
            break;
    }
    
    return doc.response(fileName);
};
