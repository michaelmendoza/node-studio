import './SidePanel.scss';
import { useContext, useState } from 'react';
import AppState from '../../state/AppState';
import ItemExplorer from './ItemExplorer';
import { ActionTypes } from '../../state/AppReducers';
import APIDataService from '../../services/APIDataService';
import Graph from '../../models/Graph';
import Modal from '../base/Modal';
import TextInput from '../base/TextInput';
import { savedProjectList } from '../../db/Saved';
import NodeList from '../../models/NodeList';
import Project from '../../models/Project';

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
    const {state} = useContext(AppState.AppContext);
    const [savedProjects, setSavedProjects] = useState(Project.load());
    const [showModal, setShowModal] = useState(false);

    const handleSave = (name) => {
        const graph = new Graph();
        graph.name = name;
        graph.nodes = { ...state.nodes };
        graph.links = [ ...state.links ];
        graph.sessions = { ...state.sessions }
        Project.save(graph);
        setSavedProjects(Project.load());
    }

    const handleUpdate = () => {
        setSavedProjects(Project.load());
    }

    const handleOpenSave = () => {
        setShowModal(true);
    }

    return (
        <div className='sidepanel-panel'>
            <h2> Projects </h2>
            <button onClick={handleOpenSave}> Save Project </button>  
            <ItemExplorer itemType={navItem.name} items={savedProjects} callback={handleUpdate}></ItemExplorer>
            <ProjectSaveModel showModal={showModal} setShowModal={setShowModal} onSave={handleSave}></ProjectSaveModel>
        </div>
    )
}

const ProjectSaveModel = ({showModal, setShowModal, onSave}) => {
    const [name, setName] = useState('');

    const handleSave = () => {
       onSave(name);
       setName('');
       setShowModal(false);
    }

    return (
        <Modal title='Save Project' open={showModal} onClose={() => setShowModal(!showModal)}>
            <div className='project-save-modal'>
                <TextInput name="Name" value={name} onChange={(e) => setName(e.target.value)}></TextInput>
                <div className='layout-row-center'>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </Modal>
    )
}

const PanelExamples = ({navItem}) => {
    return (
        <div className='sidepanel-panel'>
            <h2> Examples </h2>
            <ItemExplorer itemType={navItem.name} items={savedProjectList}></ItemExplorer>
        </div>
    )
}

const PanelRun = () => {
    const {state, dispatch} = useContext(AppState.AppContext);

    const handleRunGraph = async () => {
        const nodesToRun = [];
        Object.values(state.nodes).forEach(node => {
            const found = node.props.tags.find((x) => x === 'output' || x === 'generator');
            if (found) {
                nodesToRun.push(node.id);
            }
        });

        await APIDataService.runSesson(nodesToRun);
        dispatch({type:ActionTypes.SET_SIDENAV_SHOW, show: false })

        for(let i = 0; i < nodesToRun.length; i++) {
            const node = nodesToRun[i];
            dispatch({type:ActionTypes.UPDATE_SESSION, nodeID:node, update:true});
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
            <ItemExplorer itemType={navItem.name} items={NodeList.getList()}></ItemExplorer>
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