import './NodeInspector.scss';
import { useContext } from 'react';
import AppState from '../../state/AppState';

const NodeInspector = () => {
    const {state} = useContext(AppState.AppContext);

    return (
        <div className='node-inspector'> 
            <div>
                {
                    JSON.stringify(state.currentNode, null,'\t')
                }
            </div>
        </div>
    );
}

export default NodeInspector;