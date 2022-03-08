import Node from "../models/Node";
import APIDataService from "../services/APIDataService";

let counter = 0;
const count = () => counter++;

export const ActionTypes = {
    'INIT_GRAPH': count(),
    'ADD_NODE': count(),
    'UPDATE_NODE': count(),
    'DELETE_NODE': count(),
    'ADD_LINK': count(),
    'DELETE_LINK': count(),
    'UPDATE_SESSION': count(),
    'SET_MOUSESTATE': count(),
    'SET_ACTIVE_ELEMENT': count(),
    'SET_SIDENAV_SHOW': count()
}

export const AppReducers = (state, action) => {
    let nodes, links;

    if(action.updateAPI === true) {
        switch(action.type) {
            // Node actions
            case ActionTypes.ADD_NODE:
                APIDataService.addNode(Node.export(action.node));
                break;
            case ActionTypes.UPDATE_NODE:
                APIDataService.updateNode(Node.export(action.node));
                break;
            case ActionTypes.DELETE_NODE:
                APIDataService.deleteNode(action.nodeID);
                break;
    
            // Link actions
            case ActionTypes.ADD_LINK:
                APIDataService.addLink(action.link);
                break;
            case ActionTypes.DELETE_LINK:
                APIDataService.deleteLink(action.linkID);
                break;
            default:
        }
    }

    switch(action.type) {
        // Graph actions
        case ActionTypes.INIT_GRAPH:
            return { ...state, nodes: action.nodes, links: action.links}
        
        // Node actions
        case ActionTypes.ADD_NODE:
        case ActionTypes.UPDATE_NODE:
            nodes = { ...state.nodes };
            nodes[action.node.id] = action.node;
            return { ...state, nodes };
        case ActionTypes.DELETE_NODE:
            nodes = { ...state.nodes };
            nodes[action.nodeID] = undefined;
            links = [ ...state.links];
            const bad_links = links.filter(l => l.startNode === action.nodeID || l.endNode === action.nodeID); 
            const bad_links_match = (link) => bad_links.reduce((prev, current) => prev || link.id === current.id, false)
            links = links.filter(link => !bad_links_match(link));
            return { ...state, nodes, links };
        
        // Link actions
        case ActionTypes.ADD_LINK:
            links = [...state.links];
            links.push(action.link);
            return { ...state, links };
        case ActionTypes.DELETE_LINK:
            links = [ ...state.links ];
            links = links.filter(l => l.id !== action.linkID);
            return { ...state, links }; 

        // Session actions
        case ActionTypes.UPDATE_SESSION:
            const sessions = { ...state.sessions };
            sessions[action.nodeID] = action.update;
            return { ...state, sessions};

        // MouseState actions
        case ActionTypes.SET_MOUSESTATE:
            return { ...state, mouseState: action.mouseState }    
        
        // Active Node actions
        case ActionTypes.SET_ACTIVE_ELEMENT:
            return { ...state, activeElement: action.activeElement};

        // SideNav actions
        case ActionTypes.SET_SIDENAV_SHOW:
            return { ...state, sideNav: { ...state.sideNav, show: action.show }};

        default:
            return state;
    }
};