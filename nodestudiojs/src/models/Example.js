import APIDataService from "../services/APIDataService";
import Graph from "./Graph";

const Examples = {
    list: []
}

Examples.fetch = async () => {
    Examples.list = await APIDataService.getExamples();
}

Examples.getList = () => {
    return Examples.list;
}

Examples.load = async (example) => {
    const graph_json = await APIDataService.createGraph({json_string:JSON.stringify(example.graph)});
    return Graph.readJson(graph_json);
}

Examples.save = async (example) => {
    const list = await APIDataService.getExamples();
    list.push(example)
    await APIDataService.setExamples(list);
}

export default Examples;