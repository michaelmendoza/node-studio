import './GraphView.scss';
import { useState, useContext, useRef } from 'react';
import Graph from './Graph';
import Node from '../../models/Node';
import AppState from '../../state/AppState';
import { ActionTypes } from '../../state/AppReducers';
import MouseStates from '../../state/MouseStates';

const GraphView = () => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const graphViewRef = useRef(null);
    const sensitivity = 0.5;
    const [offset, setOffset] = useState({ x:0, y:0 });         // Offset Position for moving GraphView
    const [position, setPosition] = useState({ x:0, y:0 });     // Mouse Position in GraphView
    const [scale, setScale] = useState(1);

    const handleMouseDown = (e) => { 
        // Set allow graph move only if over the drag-target for the graph view
        if(e.target.className === 'graph-view-drag-target') {
            dispatch({ type: ActionTypes.SET_MOUSESTATE, mouseState:MouseStates.DRAG_GRAPH })
        }
    }

    const handleMouseUp = () => { 
        dispatch({ type: ActionTypes.SET_MOUSESTATE, mouseState:MouseStates.NORMAL })
    }

    const handleMouseMove = (e) => {
        var rect = graphViewRef.current.getBoundingClientRect();
        setPosition({ x:(e.pageX - rect.left)/ scale, y:(e.pageY - rect.top) / scale});
        if(state.mouseState === MouseStates.DRAG_GRAPH) {
            setOffset({x:offset.x + sensitivity * e.movementX, y:offset.y + sensitivity * e.movementY});
        }
    }

    const handleMouseLeave = () => { 
        dispatch({ type: ActionTypes.SET_MOUSESTATE, mouseState:MouseStates.NORMAL })
    }

    const handleZoomIn = () => { setScale(scale + 0.1); }

    const handleZoomOut = () => { setScale(scale - 0.1); }

    const handleFulLScreen = () => { setScale(1); }

    const handleDrop = (e) => {
        const data = e.dataTransfer.getData('text');
        var rect = e.target.getBoundingClientRect();
        var x = (e.clientX - rect.left) / scale; //x position within the element.
        var y = (e.clientY - rect.top) / scale;  //y position within the element.
        console.log(data, x, y);

        const node = Node.create(data, {x, y});
        if (node) dispatch({ type: ActionTypes.ADD_NODE, node, updateAPI:true });
    }

    const handleDragOver = (e) => {
        e.stopPropagation();
        e.preventDefault();
    }

    const handleContextMenu = e => { 
        e.preventDefault();
    }

    const x = String(offset.x) + 'px';
    const y = String(offset.y) + 'px';
    return (
        <div className='graph-view'    
            onMouseDown={handleMouseDown} 
            onMouseUp={handleMouseUp} 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}>
            <span className='graph-view-controls layout-column' >
                <button onClick={handleZoomIn}><i className="material-icons">add</i></button>
                <button onClick={handleZoomOut}><i className="material-icons">remove</i></button>
                <button onClick={handleFulLScreen}><i className="material-icons">fullscreen</i></button>
            </span>

            <span className='graph-view-position'>
                { position.x + ', ' + position.y }
            </span>
            
            <div className='graph-view-container blueprint-dots' style={{ left:x, top:y, transform: `scale(${scale}` }}>                
                <div className='graph-view-drag-target' ref={graphViewRef} onDrop={handleDrop} onDragOver={handleDragOver} onContextMenu={handleContextMenu}>
                    <Graph position={position}></Graph>
                </div>
            </div>
        </div>
    )
}

export default GraphView;