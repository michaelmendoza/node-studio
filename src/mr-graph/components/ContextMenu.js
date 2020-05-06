import React, { useState, useEffect, useContext } from 'react';
import { GraphContext } from '../contexts/GraphContext';

const ContextMenu = (props) => {    
    const { deleteNode } = useContext(GraphContext);

    const nodeOptions = [
        { name:'Delete', callback:() => { console.log('Delete'); deleteNode(props.node); }},
        { name:'Duplicate', callback:() => { console.log('Duplicate'); }}
    ]

    const graphOptions = [
        { name:'New Image', callback:() => { console.log('New Image'); }},
        { name:'New Add', callback:() => { console.log('New Add'); }}
    ]
    
    const Menu = () => {
        const positionStyle = {left:props.position.x+'px', top:props.position.y+'px'};
        const nodeMenu = nodeOptions.map((option, i)=> <li key={i} onClick={option.callback}> {option.name} </li> )
        const graphMenu = graphOptions.map((option, i)=> <li key={i} onClick={option.callback}> {option.name} </li> )

        return (
            <div className="context-menu" style={positionStyle}>
                <ul>
                    { props.node != null ?  nodeMenu : graphMenu }
                </ul>
            </div>
        )
    }

    return props.visible ? <Menu></Menu> : null;
}

export default ContextMenu;