import './FileBrowserControls.scss';
import { useState } from 'react';

const FileBrowserControls = ({ onLoad, onRefresh, onBack }) => {
    const [filter, setFilter] = useState('')

    return (
    <div className='file-browser-controls'>
        <div className='layout-row-center layout-space-between'>
            <div>
                <button onClick={onLoad}> Load Data in Folder </button>
            </div>
            <div className='controls-group'>
                <button className='button-icon' onClick={onRefresh}> <i className='material-icons'>refresh</i> </button>
                <button className='button-icon' onClick={onBack}> <i className='material-icons'>expand_less</i> </button>
            </div>
        </div>

        <div>
            <input type="text" name="path_filter" placeholder={'Filter files by name'} value={filter} onChange={(e) => setFilter(e)}/>
        </div>

    </div>
    )

}

export default FileBrowserControls;