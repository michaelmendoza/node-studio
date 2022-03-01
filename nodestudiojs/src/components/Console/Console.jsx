import './Console.scss';
import { useContext } from 'react';
import AppState from '../../state/AppState';
import Tabs from '../shared/Tabs';
import * as Logger from '../../services/LoggingService';

const Console = () => {
    return (
        <Tabs className='console' tabnames={['Console', 'Debug', 'Logs']}>
            <TerminalConsole></TerminalConsole>
            <DebugConsole></DebugConsole>
            <LogConsole></LogConsole>
        </Tabs>
    )
}

const DebugConsole = () => {
    const {state} = useContext(AppState.AppContext);
    const nodesText = JSON.stringify(state.nodes, null,'\t').split(/\r?\n/);
    const linkText = JSON.stringify(state.links, null,'\t').split(/\r?\n/);

    return (
        <div className='console-view text-align-left'>
            <div> Nodes: </div>
            {
                nodesText
            }
            <div> Links: </div>
            {
                linkText 
            }
        </div>
    )
}

const TerminalConsole = () => {
    const {state} = useContext(AppState.AppContext);

    const consoleText = '% _';

    return (
        <div className='console-view text-align-left'>
            { consoleText }
        </div>
    )
}

const LogConsole = () => {
    const logs = Logger.getLogs();

    return (
        <div className='console-view text-align-left'>
            { logs.map((log, index) => <div className='console-log-item' key={index}> { log } </div>) }
        </div>
    )
}

export default Console;