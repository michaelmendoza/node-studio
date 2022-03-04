import './Console.scss';
import { useContext, useEffect, useState, useRef } from 'react';
import AppState from '../../state/AppState';
import Tabs from '../shared/Tabs';
import * as Logger from '../../services/LoggingService';

const Console = () => {
    return (
        <Tabs className='console' tabnames={['Console', 'Debug', 'Logs']}>
            <TerminalConsole></TerminalConsole>
            <DebugConsole></DebugConsole>
            <LogConsole logCount={window.logger}></LogConsole>
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

const TerminalOutput = ({history}) => {
    return (
        <div className='terminal-output'>
            <div>
                {
                    history.map((x, i) => <div key={i}>  <span className='terminal-prompt-symbol'> $ </span> {x}</div>)
                }
            </div>
        </div>
    )
}

const TerminalInput = ({value, onChange, onSubmit, onKeyDown, inputRef}) => {

    const handleSubmit = (e) => {
        inputRef.current.focus();
        onSubmit(e);
    }

    return (
        <div className='terminal-input'>
        <form className='layout-row-center' onKeyDown={onKeyDown} onSubmit={handleSubmit}>
            <span className='terminal-prompt-symbol'> $ </span>
            <input autoFocus value={value} onChange={(e)=>onChange(e)} ref={inputRef}></input>
        </form>
    </div>
    )
}

const TerminalConsole = () => {
    const inputRef = useRef(null);

    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [input, setInput] = useState('');

    const handleClick = () => {
        inputRef.current.focus();
    }

    const handleSubmit = (e) => {
        e.stopPropagation();
        e.preventDefault();
        history.push(input)
        setHistory([...history]);
        setHistoryIndex(history.length - 1);
        setInput('');
        inputRef.current.focus();
    }

    const handleInputChange = (e) => {
        setInput(e.target.value);
    }

    const handleKeyDown = (e) => {

        let newIndex;
        switch (e.key) {
            case 'ArrowUp':
                e.stopPropagation();
                e.preventDefault();
                setInput(history[historyIndex]);
                newIndex = historyIndex - 1 < 0 ? 0 : historyIndex - 1;
                setHistoryIndex(newIndex);
                break;
            case 'ArrowDown':
                e.stopPropagation();
                e.preventDefault();
                setInput(history[historyIndex]);
                newIndex = historyIndex + 1 >= history.length ? historyIndex : historyIndex + 1; 
                setHistoryIndex(newIndex);
                break;
            default:
        }
    }

    return (
        <div className='terminal-console console-view text-align-left' onClick={handleClick}>
            <TerminalOutput history={history}></TerminalOutput>
            <TerminalInput value={input} onChange={handleInputChange} onSubmit={handleSubmit} onKeyDown={handleKeyDown} inputRef={inputRef}></TerminalInput>
        </div>
    )
}

const LogConsole = ({logCount}) => {
    const logPollInterval = 100;
    const timerIdRef = useRef(0);
    // eslint-disable-next-line no-unused-vars
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        timerIdRef.current = setInterval( () => setTimer(c => c+1), logPollInterval)
        return () => clearInterval(timerIdRef.current);
    }, []);

    const logs = Logger.getLogs();

    return (
        <div className='console-view text-align-left'>
            { logs.map((log, index) => <div className='console-log-item' key={index}> { log } </div>) }
        </div>
    )
}

export default Console;