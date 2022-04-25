import APIDataService from "../services/APIDataService";

const NodeList = {
    dict: {},
    list: []
}

NodeList.fetch = async () => {
    NodeList.dict = await APIDataService.getNodeList();
    NodeList.list = Object.values(NodeList.dict);
}

NodeList.getTypes = () => {
    return Object.keys(NodeList);
}

NodeList.getList = () => {
    return NodeList.list;
}

NodeList.getNode = (type) => {
    return NodeList.dict[type];
}

export const getNodeFromType = (type) => {
    return NodeList.getNode(type);
}

export default NodeList;