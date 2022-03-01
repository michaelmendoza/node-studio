import './GraphView.scss';
import { useState, useContext } from 'react';
import Graph from './Graph';
import Node from '../../models/Node';
import AppState from '../../state/AppState';
import { ActionTypes } from '../../state/AppReducers';

const GraphView = () => {
    const {dispatch} = useContext(AppState.AppContext);

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

    const handleDrop = (e) => {
        const data = e.dataTransfer.getData('text');
        var rect = e.target.getBoundingClientRect();
        var x = (e.clientX - rect.left) / scale; //x position within the element.
        var y = (e.clientY - rect.top) / scale;  //y position within the element.
        console.log(data, x, y);

        const node = Node.create(data, {x, y});
        dispatch({ type: ActionTypes.ADD_NODE, node });
    }

    const handleDragOver = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    const x = String(position.x) + 'px';
    const y = String(position.y) + 'px';
    return (
        <div className='graph-view'                 
            onMouseDown={handleMouseDown} 
            onMouseUp={handleMouseUp} 
            onMouseMove={handleMouseMove}>
            <span className='graph-view-controls layout-column' >
                <button onClick={handleZoomIn}><i className="material-icons">add</i></button>
                <button onClick={handleZoomOut}><i className="material-icons">remove</i></button>
                <button onClick={handleFulLScreen}><i className="material-icons">fullscreen</i></button>
            </span>

            <div className='graph-view-container blueprint-dots' style={{ left:x, top:y, transform: `scale(${scale}` }}>                
                <div style={{width:'100%', height:'100%'}} onDrop={handleDrop} onDragOver={handleDragOver}>
                    <Graph onNodeMove={setNodeMove}></Graph>
                </div>
            </div>
        </div>
    )
}

export default GraphView;