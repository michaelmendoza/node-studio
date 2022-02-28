
export const ActionTypes = {
    'GRAPH_SET_NODES_LINK': 0,
    'ADD_NODE': 1,
    'UPDATE_NODE': 2,
    'SET_CURRENT_NODE': 3
}

export const AppReducers = (state, action) => {

    switch(action.type) {
        // Graph actions
        case ActionTypes.GRAPH_SET_NODES_LINK:
            return {...state, nodes: action.nodes, links: action.links}
        
        // Node actions
        case ActionTypes.ADD_NODE:
            const nodes = [...state.nodes, action.node];
            return { ...state, nodes:nodes }

        // Active Node actions
        case ActionTypes.SET_CURRENT_NODE:
            return { ...state, currentNode: action.node};

        default:
            return state;
    }
};