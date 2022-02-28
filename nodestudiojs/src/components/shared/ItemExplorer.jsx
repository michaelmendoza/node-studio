import './ItemExplorer.scss';
import { useState } from 'react';
import NodeList from '../../models/NodeList';

const ItemExplorer = ({show, item}) => {

    const [search, setSearch] = useState('')

    const getItems = () => {
        if(item.name === 'plugins')
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
    return (<div className={'item-explorer ' + (show ? 'show':'')}>
        { 
            show ? <div>
                <h2> {item.name} </h2>
                <div className='search'>
                    <input type="text" name="node_search" placeholder={'Search'} value={search} onChange={handleSearchChange}/>
                </div>
                <div className='items-list'>
                    {
                        filteredItems.map((item) => <ItemView key={item.name} item={item}></ItemView>)
                    }
                </div>
            </div> : null
        }
        </div>
    )
}

const ItemView = ({item}) => {

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', item.type);
        
        //e.currentTarget
        //.style
        //.backgroundColor = 'yellow';
    }

    const handleDragEnd = (e) => {
        console.log(e);
    }

    return (
        <div className='node-item-view layout-row' draggable="true" onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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