import './ItemExplorer.scss';
import { useState, useContext } from 'react';
import AppState from '../../state/AppState';
import { ActionTypes } from '../../state/AppReducers';
import NodeList from '../../models/NodeList';
import { load, savedProjectList } from '../../db/Saved';

const ItemExplorer = ({item}) => {

    const itemType = item.name;
    const [search, setSearch] = useState('')

    const getItems = () => {
        if(itemType === 'projects')
            return savedProjectList;
        if(itemType === 'plugins')
            return NodeList;
        else 
            return []
    }

    const handleSearchChange = (event) => { 
        setSearch(event.currentTarget.value);
    }

    const filterBySearch = (items, search) => {
        if(search === '') return items;
        search = search.toUpperCase();
        return items.filter((item) => item.name.toUpperCase().indexOf(search) > -1);
    }

    const filteredItems = filterBySearch(getItems(), search)
    return (<div className='item-explorer'>
        { 
            <div>
                <h2> {item.name} </h2>
                <div className='search'>
                    <input type="text" name="node_search" placeholder={'Search'} value={search} onChange={handleSearchChange}/>
                </div>
                <div className='items-list'>
                    {
                        filteredItems.map((item) => <ItemView key={item.name} type={itemType} item={item}></ItemView>)
                    }
                </div>
            </div>
        }
        </div>
    )
}

const ItemView = ({type, item}) => {
    const getItem = () => {
        if (type === 'projects')
            return <ProjectItemView item={item}></ProjectItemView>
        if (type === 'plugins')
            return <PluginItemView item={item}></PluginItemView>
    }

    return getItem();
}

const ProjectItemView = ({item}) => {

    const { dispatch } = useContext(AppState.AppContext);

    const updatedAt = (new Date(item.updatedAt)).toLocaleString()
    
    const handleClick =  async () => {
        const graphData = await load(item.json_string);
        dispatch({ type:ActionTypes.INIT_GRAPH, nodes:graphData.nodes, links:graphData.links });
        dispatch({type:ActionTypes.SET_SIDENAV_SHOW, show: false })
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