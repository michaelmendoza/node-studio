import './ContextMenu.scss';
import { useContext } from 'react';
import Node from '../../models/Node';
import Link from '../../models/Link';
import {  ActionTypes, AppContext } from '../../state';

const ContextMenu = ({position, show, setShow, data}) => {    
    const {dispatch} = useContext(AppContext);

    const nodeOptions = [
        { name:'Delete', callback:() => { dispatch({type: ActionTypes.DELETE_NODE, nodeID:data.id }); setShow(false); }},
    ]
    
    const linkOptions = [
        { name:'Delete', callback:() => { dispatch({type: ActionTypes.DELETE_LINK, linkID:data.id }); setShow(false); }}
    ]

    const MenuItem = (option, i) => <li key={i} onMouseDown={option.callback}> {option.name} </li>

    const Menu = () => {
        const positionStyle = {left:position.x+'px', top:position.y+'px'};
        const nodeMenu = nodeOptions.map(MenuItem)
        const linkMenu = linkOptions.map(MenuItem)
        
        var menu = null;
        if(data instanceof Node) menu = nodeMenu;
        if(data instanceof Link) menu = linkMenu;

        return (
            <div className="context-menu" style={positionStyle}> 
                <div className='context-menu-off' onMouseDown={() => setShow(false)}></div>
                <ul>
                    { menu }
                </ul>
            </div>
        )
    }

    return show ? <Menu></Menu> : null;
}

export default ContextMenu;