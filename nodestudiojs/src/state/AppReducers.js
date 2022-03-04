
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
    'SET_ACTIVE_ELEMENT': count(),
    'SET_SIDENAV_SHOW': count()
}

export const AppReducers = (state, action) => {
    let nodes, links;

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
            nodes[action.node.id] = undefined;
            links = [ ...state.links];
            const bad_links = links.filter(l => l.startNode === action.node.id || l.endNode === action.node.id); 
            const bad_links_match = (link) => bad_links.reduce((prev, current) => prev || link.id === current.id, false)
            links = links.filter(link => !bad_links_match(link));
            return { ...state, nodes, links };
        
        // Link actions
        case ActionTypes.DELETE_LINK:
            links = [ ...state.links ];
            links = links.filter(l => l !== action.link);
            return { ...state, links }; 

        // Session actions
        case ActionTypes.UPDATE_SESSION:
            const sessions = { ...state.sessions };
            sessions[action.nodeID] = action.update;
            return { ...state, sessions};

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