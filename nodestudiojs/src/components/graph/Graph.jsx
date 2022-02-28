
import { useEffect, useContext } from 'react';
import AppState from '../../state/AppState';
import { ActionTypes } from '../../state/AppReducers';
import NodeModel from '../../models/Node';
import Node from './Node';

const Graph = ({onNodeMove}) => {
    const {state, dispatch} = useContext(AppState.AppContext);

    useEffect(() => {
        const node = NodeModel.create('FILE');
        dispatch({ type: ActionTypes.ADD_NODE, node });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="graph">
            {
                state.nodes.map((node) => <Node key={node.id} node={node} onNodeMove={onNodeMove}></Node>)
            }
        </div>
    )
}

export default Graph;