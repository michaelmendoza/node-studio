import './BottomView.scss';
import { useContext } from 'react';
import AppState from '../../state/AppState';

const BottomView = () => {
    return (
        <div className='bottom-view'>
            <div className='bottom-view-container'>
                <div className='bottom-view-nav layout-row'>
                    <div className='nav-item'> Console </div>
                </div>

                <div style={{ height:'65px', overflow: 'scroll' }}>
                    <NodeConsole></NodeConsole>
                </div>
            </div>
        </div>
    )
}

const NodeConsole = () => {
    const {state} = useContext(AppState.AppContext);

    //const consoleText = 'Testing \n Testing.'
    //const consoleLines = consoleText.split(/\r?\n/);
    const nodesText = JSON.stringify(state.nodes, null,'\t').split(/\r?\n/);
    const linkText = JSON.stringify(state.links, null,'\t').split(/\r?\n/);

    return (
        <div className='node-console text-align-left'>
            <div> Nodes: </div>
            {
                nodesText //nodesText.map((line, index) => <div key={index}> {line} </div>)
            }
            <div> Links: </div>
            {
                linkText //linkText.map((line, index) => <div key={index}> {line} </div>)
            }
        </div>
    )
}


export default BottomView;