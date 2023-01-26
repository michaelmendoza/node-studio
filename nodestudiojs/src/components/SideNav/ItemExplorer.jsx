import './ItemExplorer.scss';
import { useState, useContext } from 'react';
import AppState from '../../state/AppState';
import { ActionTypes } from '../../state/AppReducers';
import Project from '../../models/Project';
import Examples from '../../models/Example';

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

    const filteredItems = filterBySearch(items, search);

    return (<div className='item-explorer'>
        { 
            <div>
                <div className='search'>
                    <input type="text" name="node_search" placeholder={'Search'} value={search} onChange={handleSearchChange}/>
                </div>
                <div className='items-list'>
                    {
                        itemType === 'plugins' ? <ItemCategoryList filteredItems={filteredItems} itemType={itemType} callback={callback}></ItemCategoryList> : null
                    }
                    {
                        itemType !== 'plugins' ? filteredItems.map((item) => <ItemView key={item.name} type={itemType} item={item} callback={callback}></ItemView>) : null
                    }
                </div>
            </div>
        }
        </div>
    )
}

const ItemCategoryList = ({filteredItems, itemType, callback}) => {

    const categorizeItems = () => {
        const tags = Object.keys(filteredItems.reduce((p, c) => { 
            c.tags.forEach((tag) => p[tag] = tag)
            return p }, 
        {}));
        const itemsByTag = {};
        tags.forEach((tag) => itemsByTag[tag] = []);
        filteredItems.forEach((item) => itemsByTag[item.tags[0]].push(item));
        return { items:itemsByTag, tags };
    }

    const itemsByTag = categorizeItems();

    return (
        <div>
            {
                itemsByTag.tags.map((tag) => <ItemCategoryGroup key={tag} tag={tag} itemsByTag={itemsByTag} itemType={itemType} callback={callback}></ItemCategoryGroup>) 
            }
        </div>
    );
}

const ItemCategoryGroup = ({tag, itemsByTag, itemType, callback}) => {
    const [show, setShow] = useState(false);

    return (
        <div className='item-category-group'>
            <div className='plugin-tag-label layout-row-center layout-space-between' onClick={() => setShow(!show)}>
                <label>{tag}</label> 
                    <i className='material-icons'> { show ? 'arrow_drop_up' : 'arrow_drop_down'}</i> 
            </div>
            <div className='plugin-item-group layout-row flex-wrap'> 
            {
                show ? itemsByTag.items[tag].map((item) => <ItemView key={item.name} type={itemType} item={item} callback={callback}></ItemView>) : null
            }
            </div>
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
        dispatch({ type:ActionTypes.SET_SIDENAV_SHOW, show: false });
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
    
    const handleClick =  async () => {
        const graphData = await Examples.load(item);
        dispatch({ type:ActionTypes.LOAD_GRAPH, graph:graphData });
        dispatch({ type:ActionTypes.SET_SIDENAV_SHOW, show: false });
    }

    return (
        <div className='explorer-item-view project-item' onClick={handleClick}>
            <h4> { item.name } </h4>
            <label> { item.description } </label>
        </div>
    )
}

const PluginItemView = ({item}) => {
    const {dispatch} = useContext(AppState.AppContext);

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', item.type);
        dispatch({type:ActionTypes.SET_SIDENAV_BACKDROP, backdrop: false });
    }

    const handleDragEnd = (e) => {
        //dispatch({type:ActionTypes.SET_SIDENAV_SHOW, show: false });
        dispatch({type:ActionTypes.SET_SIDENAV_BACKDROP, backdrop: true });
    }

    return (
        <div className='explorer-item-view plugin-item layout-row' draggable="true" onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className='plugin-item-content'>
                <h4> {item.name} </h4>
                <label> {item.description} </label>
            </div>
        </div>
    )
}

export default ItemExplorer;