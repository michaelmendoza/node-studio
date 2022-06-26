import './SidePanel.scss';
import { useContext, useState } from 'react';
import AppState from '../../state/AppState';
import { ActionTypes } from '../../state/AppReducers';
import APIDataService from '../../services/APIDataService';
import Modal from '../base/Modal';
import TextInput from '../base/TextInput';
import NodeList from '../../models/NodeList';
import Project from '../../models/Project';
import Examples from '../../models/Example';
import Node from '../../models/Node';
import Link from '../../models/Link';
import Graph from '../../models/Graph';
import ItemExplorer from './ItemExplorer';
import Table from '../base/Table';


const SidePanel = ({activeNav}) => {
    const { state, dispatch } = useContext(AppState.AppContext);

    const handleHide = () => {
        dispatch({ type:ActionTypes.SET_SIDENAV_SHOW, show: false })
    }

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
        <div>
            { 
                state.sideNav.show ? <div className='side-panel'>
                    { state.sideNav.backdrop ? <div className='panel-backdrop' onClick={handleHide}></div> : null }
                    {  <div className='panel-content' style={{ width:'30em'}}> {render()} </div> }
                </div> : null
            }
        </div>

    )
}

const PanelFiles = () => {
    const { state, dispatch } = useContext(AppState.AppContext);
    const [filepath, setFilepath] = useState('')

    const handleTextChange = (e) => {
        setFilepath(e.target.value);
    }

    const handleFileLoad = async (e) => {
        await APIDataService.addFiles(filepath);
        let files = await APIDataService.getFiles();
        dispatch({ type:ActionTypes.SET_FILES, files });
    }

    const files = state.files.map(file => [file.name, file.type, file.path]);

    return (
        <div className='panel-files'>
            <h2> Files </h2>
            <TextInput name={'Filepath'} value={filepath} placeholder={'Enter filepath for file to load'} onChange={handleTextChange}></TextInput>
            <button onClick={handleFileLoad}> Load File </button>  

            <div className='divider'></div>

            <div>
                <h2> Available Files </h2>
                <Table data={files} headers={['Name', 'Type', 'Path']}></Table>
            </div>
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
    const {state} = useContext(AppState.AppContext);
    const [showModal, setShowModal] = useState(false);

    const handleSave = ({name, description}) => {
        const example = {}
        example.name = name;
        example.description = description;
        const nodes = {}
        Object.keys(state.nodes).forEach((nodeID) => nodes[nodeID] = Node.export(state.nodes[nodeID]));
        const links = state.links.map((link) => Link.export(link));
        example.graph = { nodes, links };
        Examples.save(example);
    }

    const handleOpenSave = () => {
        setShowModal(true);
    }

    const items = Examples.getList();

    return (
        <div className='sidepanel-panel'>
            <h2> Examples </h2>
            <button onClick={handleOpenSave}> Save Example </button>  
            <ItemExplorer itemType={navItem.name} items={items}></ItemExplorer>
            <ExampleSaveModel showModal={showModal} setShowModal={setShowModal} onSave={handleSave}></ExampleSaveModel>
        </div>
    )
}

const ExampleSaveModel = ({showModal, setShowModal, onSave}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
       onSave({name, description});
       setName('');
       setDescription('');
       setShowModal(false);
    }

    return (
        <Modal title='Save Example' open={showModal} onClose={() => setShowModal(!showModal)}>
            <div className='project-save-modal'>
                <TextInput name="Name" value={name} onChange={(e) => setName(e.target.value)}></TextInput>
                <TextInput name="Description" value={description} onChange={(e) => setDescription(e.target.value)}></TextInput>
                <div className='layout-row-center'>
                    <button onClick={handleSave}>Save</button>
                </div>
            </div>
        </Modal>
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

        dispatch({type:ActionTypes.SET_SIDENAV_SHOW, show: false });
        await APIDataService.runSesson(nodesToRun);
        const metadata = await APIDataService.getGraphNodeViewMetadata();
        dispatch({ type:ActionTypes.UPDATE_SESSION, metadata });
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