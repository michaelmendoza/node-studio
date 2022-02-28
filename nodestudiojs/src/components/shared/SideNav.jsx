import './SideNav.scss';
import { useState } from 'react';
import ItemExplorer from './ItemExplorer';

const NavItem = ({item, onClick}) => {
    return (
        <div key={item.name} className='nav-item' onClick={(e) => onClick(e, item)}> <i className="material-icons">{item.icon}</i> <label> {item.name} </label> </div>
    )
}

const SideNav = () => {
    const [show, setShow] = useState(false);
    const [item, setItem] = useState({ name: '', icon:''}, );

    const items = [
        { name: 'files', icon:'library_add'}, 
        { name: 'projects', icon:'folder_open'},
        { name: 'run', icon:'play_arrow'},
        { name: 'plugins', icon:'extension'},
        { name: 'share', icon:'share'}
    ];

    const handleClickNav = (e, navItem) => {
        setShow(!show);
        setItem(navItem);
    }

    return (
        <div className='side-nav'>
            {
                <ItemExplorer show={show} setShow={setShow} item={item}></ItemExplorer>
            }
            <div className='layout-column'>
                {
                    items.map((item) => <NavItem item={item} onClick={handleClickNav}></NavItem>)
                }
            </div>
        </div>
    )
}

export default SideNav;