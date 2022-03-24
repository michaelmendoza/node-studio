import './ItemExplorer.scss';
import { useState, useContext } from 'react';
import AppState from '../../state/AppState';
import { ActionTypes } from '../../state/AppReducers';
import { load } from '../../db/Saved';
import Project from '../../models/Project';

const ItemExplorer = ({itemType, items = [], callback}) => {

    const [search, setSearch] = useState('');

    const handleSearchChange = (event) => { 
        setSearch(event.currentTarget.value);
    }

    const filterBySearch = (items, search) => {
        if(items === null) return [];
        if(search === '') return items;
        search = search.toUpperCase();
        return items.filter((item) => item.name.toUpperCase().indexOf(search) > -1);
    }

    const filteredItems = filterBySearch(items, search)
    return (<div className='item-explorer'>
        { 
            <div>
                <div className='search'>
                    <input type="text" name="node_search" placeholder={'Search'} value={search} onChange={handleSearchChange}/>
                </div>
                <div className='items-list'>
                    {
                        filteredItems.map((item) => <ItemView key={item.name} type={itemType} item={item} callback={callback}></ItemView>)
                    }
                </div>
            </div>
        }
        </div>
    )
}

const ItemView = ({type, item, callback}) => {
    const getItem = () => {
        if (type === 'projects')
            return <ProjectItemView item={item} callback={callback}></ProjectItemView>
        if (type === 'examples')
            return <ExamplesItemView item={item}></ExamplesItemView>
        if (type === 'plugins')
            return <PluginItemView item={item}></PluginItemView>
    }

    return getItem();
}

const ProjectItemView = ({item, callback}) => {

    const { dispatch } = useContext(AppState.AppContext);
    
    const handleClick =  async () => {    
        dispatch({ type:ActionTypes.LOAD_GRAPH, graph:item, updateAPI: true });
        dispatch({ type:ActionTypes.SET_SIDENAV_SHOW, show: false })
    }

    const handleDeleteItem = () => {
        Project.deleteSave(item);
        callback();
    }

    const updatedAt = (new Date(item.updatedAt)).toLocaleString()

    return (
        <div className='explorer-item-view project-item' >
            <button className='button-icon' onClick={handleDeleteItem}> <i className="material-icons" >close</i> </button> 
            <div onClick={handleClick}>
                <h4> { item.name } </h4>
                <label> { item.description } </label>
                <label> Updated: { updatedAt } </label>
            </div>
        </div>
    )
}

const ExamplesItemView = ({item}) => {

    const { dispatch } = useContext(AppState.AppContext);

    const updatedAt = (new Date(item.updatedAt)).toLocaleString()
    
    const handleClick =  async () => {
        const graphData = await load(item.json_string);
        dispatch({ type:ActionTypes.INIT_GRAPH, graph:graphData });
        dispatch({ type:ActionTypes.SET_SIDENAV_SHOW, show: false });
    }

    return (
        <div className='explorer-item-view project-item' onClick={handleClick}>
            <h4> { item.name } </h4>
            <label> { item.description } </label>
            <label> Updated: { updatedAt } </label>
        </div>
    )
}

const PluginItemView = ({item}) => {
    const {dispatch} = useContext(AppState.AppContext);

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', item.type);
    }

    const handleDragEnd = (e) => {
        dispatch({type:ActionTypes.SET_SIDENAV_SHOW, show: false });
    }

    return (
        <div className='explorer-item-view plugin-item layout-row' draggable="true" onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div>
                <img src='https://via.placeholder.com/36' alt='node item'/>
            </div>
            <div className='description'>
                <h4> {item.name} </h4>
                <label> {item.description} </label>
            </div>
        </div>
    )
}

export default ItemExplorer;