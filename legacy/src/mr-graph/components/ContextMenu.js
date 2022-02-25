import React, { useState, useEffect, useContext } from 'react';
import { GraphContext } from '../contexts/GraphContext';
import { NodeType } from './NodeCompute';

const ContextMenu = (props) => {    
    props = props.data;
    const { createNode, deleteNode, deleteLink } = useContext(GraphContext);

    const nodeOptions = [
        { name:'Delete', callback:() => { console.log('Delete Node'); deleteNode(props.node); }},
        { name:'Duplicate', callback:() => { console.log('Duplicate Node'); createNode(props.node.nodeType, props.position.x + 20, props.position.y + 20); }}
    ]
    
    const linkOptions = [
        { name:'Delete', callback:() => {console.log('Delete Link'); deleteLink(props.link); }}
    ]

    const graphOptions = [
        { name:'New Image', callback:() => { console.log('New Image'); createNode(NodeType.IMAGE, props.position.x, props.position.y); }},
        { name:'New Add', callback:() => { console.log('New Add'); createNode(NodeType.ADD, props.position.x, props.position.y); }}
    ]

    const MenuItem = (option, i) => <li key={i} onClick={option.callback}> {option.name} </li>

    const Menu = () => {
        const positionStyle = {left:props.position.x+'px', top:props.position.y+'px'};
        const nodeMenu = nodeOptions.map(MenuItem)
        const linkMenu = linkOptions.map(MenuItem)
        const graphMenu = graphOptions.map(MenuItem)
        
        var menu = graphMenu;
        if(props.node != null) menu = nodeMenu;
        if(props.link != null) menu = linkMenu;

        return (
            <div className="context-menu" style={positionStyle}>
                <ul>
                    { menu }
                </ul>
            </div>
        )
    }

    return props.visible ? <Menu></Menu> : null;
}

export default ContextMenu;