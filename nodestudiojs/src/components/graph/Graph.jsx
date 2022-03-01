
import { useContext } from 'react';
import AppState from '../../state/AppState';
import LinksSVG from './LinksSVG';
import Node from './Node';

const Graph = ({onNodeMove}) => {
    const {state} = useContext(AppState.AppContext);

    return (
        <div className="graph">
            
            {
                Object.values(state.nodes).map((node) => <Node key={node.id} node={node} onNodeMove={onNodeMove}></Node>)
            }

            <LinksSVG></LinksSVG>

        </div>
    )
}

export default Graph;