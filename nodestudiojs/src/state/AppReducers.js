
export const ActionTypes = {
    'INIT_GRAPH': 0,
    'ADD_NODE': 1,
    'UPDATE_NODE': 2,
    'SET_CURRENT_NODE': 3
}

export const AppReducers = (state, action) => {

    switch(action.type) {
        // Graph actions
        case ActionTypes.INIT_GRAPH:
            return {...state, nodes: action.nodes, links: action.links}
        
        // Node actions
        case ActionTypes.ADD_NODE:
            const id = action.node.id;
            const nodes = {...state.nodes };
            nodes[id] = action.node;
            return { ...state, nodes:nodes }

        // Active Node actions
        case ActionTypes.SET_CURRENT_NODE:
            return { ...state, currentNode: action.node};

        default:
            return state;
    }
};