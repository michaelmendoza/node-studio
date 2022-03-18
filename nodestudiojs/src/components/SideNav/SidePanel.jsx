import './SidePanel.scss';
import { useContext } from 'react';
import AppState from '../../state/AppState';
import ItemExplorer from '../shared/ItemExplorer';
import { ActionTypes } from '../../state/AppReducers';
import APIDataService from '../../services/APIDataService';

const SidePanel = ({activeNav}) => {
    const {state} = useContext(AppState.AppContext);

    const render = () => {
        if (activeNav.name === 'files') return <PanelFiles></PanelFiles>
        if (activeNav.name === 'projects') return <PanelProjects navItem={activeNav}></PanelProjects>        
        if (activeNav.name === 'examples') return <PanelExamples navItem={activeNav}></PanelExamples>
        if (activeNav.name === 'run') return <PanelRun></PanelRun>
        if (activeNav.name === 'plugins') return <PanelPlugins navItem={activeNav}></PanelPlugins>
        if (activeNav.name === 'share') return  <PanelShare></PanelShare>
        else return null
    }

    return (
        <div className='side-panel'>
            { state.sideNav.show ? render() : null }
        </div>
    )
}

const PanelFiles = () => {
    const handleOnLoad = (e) => {
        let filepath = e.target.files[0].name;
    }

    return (
        <div className='panel-files'>
            <h2> Files </h2>
            <input type="file" multiple onChange={handleOnLoad}/>
        </div>
    )
}

const PanelProjects = ({navItem}) => {
    const handleSave = () => {
        
    }

    return (
        <div className='sidepanel-panel'>
            <h2> Projects </h2>
            <button onClick={handleSave}> Save Project </button>  
            <ItemExplorer item={navItem}></ItemExplorer>
        </div>
    )
}

const PanelExamples = ({navItem}) => {
    return (
        <div className='sidepanel-panel'>
            <h2> Examples </h2>
            <ItemExplorer item={navItem}></ItemExplorer>
        </div>
    )
}

const PanelRun = () => {
    const {state, dispatch} = useContext(AppState.AppContext);

    const handleRunGraph = async () => {
        const nodesToRun = []
        Object.values(state.nodes).forEach(node => {
            if (node.type === 'DISPLAY' || node.type === 'CDISPLAY') {
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

    return (
        <div className='panel-run'> 
            <h2> Run </h2> 
            <button onClick={handleRunGraph}> Run and Debug </button>  
        </div>
    )
}

const PanelPlugins = ({navItem}) => {
    return (
        <div className='sidepanel-panel'>
            <h2> Plugins </h2>
            <ItemExplorer item={navItem}></ItemExplorer>
        </div>
    )
}

const PanelShare = () => {
    return (
        <div className='panel-share'> 
            <h2> Share </h2> 
            <div> Share with people and groups </div> <button> Copy Link </button>  
        </div>
    )
}

export default SidePanel;