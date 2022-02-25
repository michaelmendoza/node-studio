import './BottomView.scss';

const BottomView = () => {
    return (
        <div className='bottom-view'>
            <div className='bottom-view-container'>
                <div className='bottom-view-nav layout-row'>
                    <div className='nav-item'> Console </div>
                </div>

                <NodeConsole></NodeConsole>
            </div>
        </div>
    )
}

const NodeConsole = () => {
    const consoleText = 'Testing \n Testing.'
    const consoleLines = consoleText.split(/\r?\n/);

    return (
        <div className='node-console text-align-left'>
            {
                consoleLines.map((line, index) => <div key={index}> {line} </div>)
            }
        </div>
    )
}


export default BottomView;