import './FileBrowserPath.scss';

const FileBrowserPath = ({ path }) => {

    const formatPath = () => {
        const pathArray = path.split('/');
        return pathArray.map((pathItem, index) => <span key={index}>{ pathItem } / </span>)
    }

    return (
    <div className='file-browser-path'>
        <i className='material-icons'>folder</i>
        <div className='path'> / { formatPath() }  </div>
    </div>
    )
}

export default FileBrowserPath;