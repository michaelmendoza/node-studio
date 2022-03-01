import './SideNav.scss';
import { useState, useContext } from 'react';
import AppState from '../../state/AppState';
import ItemExplorer from './ItemExplorer';
import { ActionTypes } from '../../state/AppReducers';

export const NavItemList = [
    { name: 'files', icon:'library_add'}, 
    { name: 'projects', icon:'folder_open'},
    { name: 'run', icon:'play_arrow'},
    { name: 'plugins', icon:'extension'},
    { name: 'share', icon:'share'}
];

const SideNav = () => {
    const {state, dispatch} = useContext(AppState.AppContext);
    const [activeNav, setActiveNav] = useState(null);

    const handleClickNav = (e, navItem) => {
        setActiveNav(navItem);

        if(navItem.name !== activeNav?.name) {
            dispatch({ type:ActionTypes.SET_SIDENAV_SHOW, show:true });
        }
        else {
            dispatch({ type:ActionTypes.SET_SIDENAV_SHOW, show:!state.sideNav.show });
        }
    }
    
    return (
        <div className='side-nav'>
                
            { state.sideNav.show && activeNav.name === 'run' ? <div className='item-explorer'> <h2> {activeNav.name} </h2> <button> Run and Debug </button>  </div> : null }
            { state.sideNav.show && activeNav.name !== 'run' ?  <ItemExplorer item={activeNav}></ItemExplorer>: null }
            
            <div className='layout-column'>
                {
                    NavItemList.map((item) => <NavItem key={item.name} item={item} onClick={handleClickNav}></NavItem>)
                }
            </div>
        </div>
    )
}

const NavItem = ({item, onClick}) => {
    return (
        <div key={item.name} className='nav-item' onClick={(e) => onClick(e, item)}> 
            <i className="material-icons">{item.icon}</i> 
            <label> {item.name} </label> 
        </div>
    )
}

export default SideNav;