import { fetchAPI, FetchTypes } from "./FetchUtils";

console.log(process.env);
export const dataUrl = process.env.API_URL || 'http://localhost:8000/api';

const APIDataService = {

    // ************* Graph *************

    getGraph: body => fetchAPI(`${dataUrl}/graph`, FetchTypes.GET),

    createGraph: body => fetchAPI(`${dataUrl}/graph`, FetchTypes.POST, body),

    resetGraph: body => fetchAPI(`${dataUrl}/graph/reset`, FetchTypes.GET),

    getNodeList: () => fetchAPI(`${dataUrl}/nodelist`, FetchTypes.GET),

    getNode: (node_id, slice, index) => fetchAPI(`${dataUrl}/node?node_id=${node_id}&slice=${slice}&index=${index}`, FetchTypes.GET),

    addNode: (node) => fetchAPI(`${dataUrl}/node/add`, FetchTypes.POST, node),

    updateNode: (node) =>  fetchAPI(`${dataUrl}/node/update`, FetchTypes.POST, node),

    deleteNode: (node_id) => fetchAPI(`${dataUrl}/node/delete`, FetchTypes.POST, { id:node_id }),

    addLink: (link) => fetchAPI(`${dataUrl}/link/add`, FetchTypes.POST, link),

    deleteLink: (link_id) => fetchAPI(`${dataUrl}/link/delete`, FetchTypes.POST, { id:link_id }),

    runSesson: body =>  fetchAPI(`${dataUrl}/session`, FetchTypes.POST, body),
}

export default APIDataService;