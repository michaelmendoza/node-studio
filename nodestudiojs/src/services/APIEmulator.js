import { ActionTypes } from "../state";
import APIDataService from "./APIDataService";

const APIEmulator = {
    run: async (cmd_string, dispatch) => {
        console.log('emulator run');
        const substrings = cmd_string.split(' ');
        const cmd = substrings[0];
        const arg = substrings[1];

        switch(cmd) {
            case '':
                return '';
            case 'man':
                return `Allowed commands: clear, graph, delete_link, delete_node`;
            case 'graph':
                return await APIDataService.getGraph();
            case 'delete_link':
                dispatch({type: ActionTypes.DELETE_LINK, linkID: arg})
                return '';
            case 'delete_node':
                dispatch({type: ActionTypes.DELETE_NODE, nodeID: arg})
                return '';
            case 'timeout':
                return await new Promise(resolve => setTimeout(() => resolve('timeout'), 1000));
            default:
                return 'Error: Invalid command'
        }
    }
}

export default APIEmulator;