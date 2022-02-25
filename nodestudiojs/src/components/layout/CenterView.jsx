import './CenterView.scss';
import { useState } from 'react';
import Graph from '../graph/Graph';

const CenterView = () => {
    const sensitivity = 0.5;
    const [position, setPosition] = useState({ x:0, y:0 });
    const [scale, setScale] = useState(1);
    const [moveView, setMoveView] = useState(false);
    const [nodeMove, setNodeMove] = useState(false);

    const handleMouseDown = () => {
        setMoveView(true);
    }

    const handleMouseUp = () => {
        setMoveView(false);
    }

    const handleMouseMove = (e) => {
        if(moveView & !nodeMove) {
            setPosition({x:position.x + sensitivity * e.movementX, y:position.y + sensitivity * e.movementY});
        }
    }

    const handleZoomIn = () => {
        setScale(scale + 0.1);
    }

    const handleZoomOut = () => {
        setScale(scale - 0.1);
    }

    const handleFulLScreen = () => {
        setScale(1);
    }

    const x = String(position.x) + 'px';
    const y = String(position.y) + 'px';
    return (
        <div className='center-view'                 
            onMouseDown={handleMouseDown} 
            onMouseUp={handleMouseUp} 
            onMouseMove={handleMouseMove}>
            <span className='center-view-controls ayout-column' >
                <button onClick={handleZoomIn}><i className="material-icons">add</i></button>
                <button onClick={handleZoomOut}><i className="material-icons">remove</i></button>
                <button onClick={handleFulLScreen}><i className="material-icons">fullscreen</i></button>
            </span>

            <div className='center-view-container blueprint-dots' style={{ left:x, top:y, transform: `scale(${scale}`  }} >                
                <Graph onNodeMove={setNodeMove}></Graph>
            </div>
        </div>
    )
}

export default CenterView;