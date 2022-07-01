import { fetchAPI, FetchTypes } from "./FetchUtils";

export const dataUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const APIDataService = {

    // ************* Graph *************

    getGraph: () => fetchAPI(`${dataUrl}/graph`, FetchTypes.GET),

    createGraph: body => fetchAPI(`${dataUrl}/graph`, FetchTypes.POST, body),

    resetGraph: () => fetchAPI(`${dataUrl}/graph/reset`, FetchTypes.GET),

    getGraphNodeViewMetadata: () => fetchAPI(`${dataUrl}/graph/nodeview_metadata`, FetchTypes.GET),

    // ************* Nodes *************

    getNodeList: () => fetchAPI(`${dataUrl}/nodelist`, FetchTypes.GET),

    getNode: (node_id, slice, index) => fetchAPI(`${dataUrl}/node?node_id=${node_id}&slice=${slice}&index=${index}`, FetchTypes.GET),

    getNodeMetadata: (node_id) => fetchAPI(`${dataUrl}/node_metadata?node_id=${node_id}`, FetchTypes.GET),

    getNodeValue : (node_id, key) => fetchAPI(`${dataUrl}/node/value?node_id=${node_id}&key=${key}`, FetchTypes.GET),

    getNodeValueUncompressed: (node_id, key) => fetchAPI(`${dataUrl}/node/value/uncompressed?node_id=${node_id}&key=${key}`, FetchTypes.GET),

    getNodeType : (node_id) => fetchAPI(`${dataUrl}/node/type?node_id=${node_id}`, FetchTypes.GET),

    getNodeShape : (node_id) => fetchAPI(`${dataUrl}/node/shape?node_id=${node_id}`, FetchTypes.GET),

    getNodeViewMetadata : (node_id) => fetchAPI(`${dataUrl}/node/view_metadata?node_id=${node_id}`, FetchTypes.GET),
    
    addNode: (node) => fetchAPI(`${dataUrl}/node/add`, FetchTypes.POST, node),

    updateNode: (node) =>  fetchAPI(`${dataUrl}/node/update`, FetchTypes.POST, node),

    deleteNode: (node_id) => fetchAPI(`${dataUrl}/node/delete`, FetchTypes.POST, { id:node_id }),

    // ************* Links *************

    addLink: (link) => fetchAPI(`${dataUrl}/link/add`, FetchTypes.POST, link),

    deleteLink: (link_id) => fetchAPI(`${dataUrl}/link/delete`, FetchTypes.POST, { id:link_id }),

    // ************* Session *************

    runSesson: body =>  fetchAPI(`${dataUrl}/session`, FetchTypes.POST, body),

    // ************* Examples *************

    getExamples: () => fetchAPI(`${dataUrl}/examples`, FetchTypes.GET),

    setExamples: (examples) => fetchAPI(`${dataUrl}/examples`, FetchTypes.POST, examples),

    // ************* Directory Files *************

    getCurrentDirectoryEntries: (path) => fetchAPI(`${dataUrl}/current_directory_entries?path=${path}`, FetchTypes.GET),

    // ************* Files *************

    getFiles: () => fetchAPI(`${dataUrl}/files`, FetchTypes.GET),

    addFiles: (filepath) => fetchAPI(`${dataUrl}/files/add?filepath=${filepath}`, FetchTypes.GET),

    updateFile: (id, name) => fetchAPI(`${dataUrl}/files/update?id=${id}&name=${name}`, FetchTypes.GET),

    getFilePreview: (id, size = 128) => fetchAPI(`${dataUrl}/files/preview?id=${id}&size=${size}`, FetchTypes.GET),

}

export default APIDataService;