
export const ActionTypes = {
    'INIT_GRAPH': 0,
    'ADD_NODE': 1,
    'UPDATE_NODE': 2,
    'SET_CURRENT_NODE': 3,
    'SET_SIDENAV_SHOW': 4
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
            return { ...state, nodes:nodes }

        // Active Node actions
        case ActionTypes.SET_CURRENT_NODE:
            return { ...state, currentNode: action.node};

        // SideNav actions
        case ActionTypes.SET_SIDENAV_SHOW:
            return { ...state, sideNav: { ...state.sideNav, show: action.show }}

        default:
            return state;
    }
};