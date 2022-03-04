import './SideNav.scss';
import { useState, useContext } from 'react';
import AppState from '../../state/AppState';
import ItemExplorer from '../shared/ItemExplorer';
import { ActionTypes } from '../../state/AppReducers';
import APIDataService from '../../services/APIDataService';

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
            <SidePanel activeNav={activeNav}></SidePanel>
            
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

const SidePanel = ({activeNav}) => {
    const {state, dispatch} = useContext(AppState.AppContext);

    const handleRunGraph = async () => {
        const nodesToRun = []
        Object.values(state.nodes).forEach(node => {
            if (node.type === 'DISPLAY') {
                nodesToRun.push(node);
            }
        });

        for(let i = 0; i < nodesToRun.length; i++) {
            const node = nodesToRun[i];
            await APIDataService.runSesson({id: node.id});
            dispatch({type:ActionTypes.UPDATE_SESSION, nodeID:node.id, update:true});
            dispatch({type:ActionTypes.SET_SIDENAV_SHOW, show: false })
        }
    }

    const render = () => {
        if (activeNav.name === 'run') return  <div className='panel-run'> <h2> {activeNav.name} </h2> <button onClick={handleRunGraph}> Run and Debug </button>  </div>
        if (activeNav.name === 'share') return  <div className='panel-share'> <h2> {activeNav.name} </h2> <div> Share with people and groups </div> <button> Copy Link </button>  </div>
        else return <ItemExplorer item={activeNav}></ItemExplorer>
    }

    return (
        <div className='side-panel'>
            { state.sideNav.show ? render() : null }
        </div>
    )
}

export default SideNav;