
import { useContext, useState } from 'react';
import AppState from '../../state/AppState';
import LinksSVG from './LinksSVG';
import Node from './Node';
import ContextMenu from './ContextMenu';

const Graph = ({position: mousePosition}) => {
    const {state} = useContext(AppState.AppContext);
    const [show, setShow] = useState(false);
    const [data, setData] = useState(null);
    const [position, setPosition] = useState({ x:0, y:0 });
    const handleContextMenu = (e, show, element) => {
        setShow(show);
        setData(element);
        setPosition(mousePosition);
    }

    return (
        <div className="graph" onMouseLeave={() => setShow(false)}>
            <ContextMenu show={show} position={position} setShow={setShow} data={data}></ContextMenu>
            {
                Object.values(state.nodes).map((node) => node ? <Node key={node.id} node={node} onContextMenu={handleContextMenu}></Node> : null)
            }
            <LinksSVG position={mousePosition} onContextMenu={handleContextMenu}></LinksSVG>
        </div>
    )
}

export default Graph;