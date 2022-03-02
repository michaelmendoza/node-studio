
export const ActionTypes = {
    'INIT_GRAPH': 0,
    'ADD_NODE': 1,
    'UPDATE_NODE': 2,
    'UPDATE_SESSION': 3,
    'SET_CURRENT_NODE': 4,
    'SET_SIDENAV_SHOW': 5
}

export const AppReducers = (state, action) => {
    let nodes;

    switch(action.type) {
        // Graph actions
        case ActionTypes.INIT_GRAPH:
            return {...state, nodes: action.nodes, links: action.links}
        
        // Node actions
        case ActionTypes.ADD_NODE:
        case ActionTypes.UPDATE_NODE:
            nodes = {...state.nodes };
            nodes[action.node.id] = action.node;
            return { ...state, nodes };

        // Session actions
        case ActionTypes.UPDATE_SESSION:
            const sessions = { ...state.sessions };
            sessions[action.nodeID] = action.update;
            return { ...state, sessions};

        // Active Node actions
        case ActionTypes.SET_CURRENT_NODE:
            return { ...state, currentNode: action.node};

        // SideNav actions
        case ActionTypes.SET_SIDENAV_SHOW:
            return { ...state, sideNav: { ...state.sideNav, show: action.show }};

        default:
            return state;
    }
};