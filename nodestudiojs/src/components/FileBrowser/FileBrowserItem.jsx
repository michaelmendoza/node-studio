import './FileBrowserItem.scss';

const FileBrowserItem = ({ item, type, onSelect }) => {

    const handleSelect = () => {
        onSelect(item, type);
    }

    return (
    <div className='file-browser-item' onClick={handleSelect}>
        { type === 'folder' ? <i className='material-icons'>folder_open</i> : null }
        { type === 'file' ? <i className='material-icons'>image</i> : null }
        <label> { item } </label>
    </div>
    )
}

export default FileBrowserItem;