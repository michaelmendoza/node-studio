import { fetchAPI, FetchTypes } from "./FetchUtils";

const dataUrl = 'http://localhost:8000/api';

const APIDataService = {

    // ************* Graph *************

    getGraph: body => fetchAPI(`${dataUrl}/graph`, FetchTypes.GET),

    createGraph: body => fetchAPI(`${dataUrl}/graph`, FetchTypes.POST, body),
}

export default APIDataService;