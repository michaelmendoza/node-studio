import { fetchAPI, FetchTypes } from "./FetchUtils";

export const dataUrl = 'http://localhost:8000/api';

const APIDataService = {

    // ************* Graph *************

    getGraph: body => fetchAPI(`${dataUrl}/graph`, FetchTypes.GET),

    createGraph: body => fetchAPI(`${dataUrl}/graph`, FetchTypes.POST, body),

    getNode: (node_id, slice, index) => fetchAPI(`${dataUrl}/node?node_id=${node_id}&slice=${slice}&index=${index}`, FetchTypes.GET),

    runSesson: body =>  fetchAPI(`${dataUrl}/session`, FetchTypes.POST, body),
}

export default APIDataService;