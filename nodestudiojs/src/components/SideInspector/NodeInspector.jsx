import './NodeInspector.scss';
import { useContext } from 'react';
import AppState from '../../state/AppState';

const NodeInspector = () => {
    const {state} = useContext(AppState.AppContext);

    return (
        <div className='node-inspector'> 
            <div>
                {
                    state.activeElement ? Object.keys(state.activeElement).map( (key) => {
                        return (<div key={key}>
                            <label>{key}</label>
                            <div>{JSON.stringify(state.activeElement[key], null,'\t')}</div>
                        </div>) 
                    }) : null
                }
            </div>
        </div>
    );
}

export default NodeInspector;