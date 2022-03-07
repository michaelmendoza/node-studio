import { fetchAPI, FetchTypes } from "./FetchUtils";

export const dataUrl = 'http://localhost:8000/api';

const APIDataService = {

    // ************* Graph *************

    getGraph: body => fetchAPI(`${dataUrl}/graph`, FetchTypes.GET),

    createGraph: body => fetchAPI(`${dataUrl}/graph`, FetchTypes.POST, body),

    getNodeList: () => fetchAPI(`${dataUrl}/nodelist`, FetchTypes.GET),

    getNode: (node_id, slice, index) => fetchAPI(`${dataUrl}/node?node_id=${node_id}&slice=${slice}&index=${index}`, FetchTypes.GET),

    addNode: (node) => fetchAPI(`${dataUrl}/node/add`, FetchTypes.POST, node),

    updateNode: (node) =>  fetchAPI(`${dataUrl}/node/update`, FetchTypes.POST, node),

    deleteNode: (node_id) => fetchAPI(`${dataUrl}/node/delete`, FetchTypes.POST, { id:node_id }),

    deleteLink: (link_id) => fetchAPI(`${dataUrl}/link/delete`, FetchTypes.POST, { id:link_id }),

    runSesson: body =>  fetchAPI(`${dataUrl}/session`, FetchTypes.POST, body),
}

export default APIDataService;