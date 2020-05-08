import React, { useState, useEffect, useContext } from 'react';
import { GraphContext } from '../contexts/GraphContext';
import { NodeType } from './NodeCompute';

const ContextMenu = (props) => {    
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

    const Menu = () => {
        const positionStyle = {left:props.position.x+'px', top:props.position.y+'px'};
        const nodeMenu = nodeOptions.map((option, i)=> <li key={i} onClick={option.callback}> {option.name} </li> )
        const linkMenu = linkOptions.map((option, i)=> <li key={i} onClick={option.callback}> {option.name} </li> )
        const graphMenu = graphOptions.map((option, i)=> <li key={i} onClick={option.callback}> {option.name} </li> )
        let menu = graphMenu;
        menu =  props.node != null ?  nodeMenu : graphMenu;
        menu = props.link != null ? linkMenu : menu;

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