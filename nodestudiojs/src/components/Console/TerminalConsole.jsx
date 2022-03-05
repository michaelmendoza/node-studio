import './TerminalConsole.scss';
import { useState, useRef, useContext } from 'react';
import { ActionTypes, AppContext } from '../../state';
import APIEmulator from '../../services/APIEmulator';

const TerminalOutput = ({history}) => {
    return (
        <div className='terminal-output'>
            {
                history.map((x, i) => <div className='output-item' key={i}>  
                    <div className='output-cmd'> <span className='terminal-prompt-symbol'> $ </span> {x.cmd} </div>
                    <div className='otuput-message'> {x.message} </div>
                </div>)
            }
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
    const {dispatch} = useContext(AppContext);

    const inputRef = useRef(null);
    const emulator = useRef({ isBusy: false });

    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [input, setInput] = useState('');

    const handleClick = () => {
        inputRef.current.focus();
    }

    const handleSubmit = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        // Only allow updates if emulator isn't busy
        if(emulator.current.isBusy) return;

        // Clear command - Doesn't need emulator
        if(input.split()[0] === 'clear') {
            setHistory([]);
            setInput('');
            inputRef.current.focus();
            return;
        }

        // Create cmd, set emulator to busy and run emulator 
        const cmd = { cmd:input, message:'' };
        emulator.current.isBusy = true;
        APIEmulator.run(cmd.cmd, dispatch).then((data) => {
            // Set emulator to not busy, and update history and inputs 
            emulator.current.isBusy = false;
            cmd.message = data;

            history.push(cmd);
            setHistory([...history]);
            setHistoryIndex(history.length - 1);
            setInput('');
            inputRef.current.focus();
        })

        inputRef.current.focus();
    }

    const handleInputChange = (e) => {
        if(emulator.current.isBusy) return;
        setInput(e.target.value);
    }

    const handleKeyDown = (e) => {
        if(emulator.current.isBusy) return;

        let newIndex;
        switch (e.key) {
            case 'ArrowUp':
                e.stopPropagation();
                e.preventDefault();
                setInput(history[historyIndex].cmd);
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
        <div className='terminal-console' onClick={handleClick}>
            <TerminalOutput history={history}></TerminalOutput>
            <TerminalInput value={input} onChange={handleInputChange} onSubmit={handleSubmit} onKeyDown={handleKeyDown} inputRef={inputRef}></TerminalInput>
        </div>
    )
}

export default TerminalConsole;