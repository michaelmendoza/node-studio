import React from 'react';

const ContextMenu = (props) => {
    
    const options = [
        { name:'Delete', callback:null },
        { name:'Duplicate', callback:null }
    ]
    

    const Menu = () => {
        const positionStyle = {left:props.position.x+'px', top:props.position.y+'px'};

        return (
            <div className="context-menu" style={positionStyle}>
                <ul>
                    { options.map((option, i)=> <li key={i}> {option.name} </li> )}
                </ul>
            </div>
        )
    }

    return props.visible ? <Menu></Menu> : null;
}

export default ContextMenu;