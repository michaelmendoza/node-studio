import './FileBrowser.scss';
import { useEffect, useState } from 'react';
import APIDataService from '../../services/APIDataService';
import FileBrowserPath from './FileBrowserPath';
import FileBrowserControls from './FileBrowserControls';
import FileBrowserItem from './FileBrowserItem';
import { useAppState } from '../../state/AppState';
import { ActionTypes } from '../../state';
import FileNamingModal from './FileNamingModal';

const FileBrowser = ({onSelect}) => {
    const { dispatch } = useAppState();
    const [relativePath, setRelativePath] = useState('data');
    const [pathInfo, setPathInfo] = useState({ path:'', folders:[], files:[] });
    const [showModal, setShowModal] = useState(false);
    const [filename, setFilename] = useState('');
    const [path, setPath] = useState('');

    useEffect(()=>{
        const fetch = async() => {
            let data = await APIDataService.getPathQuery(relativePath);
            if (data) setPathInfo(data);
            else data = { path:'', folders:[], files:[] };
        }

        fetch();
    },[relativePath])

    const handleFileItemSelect = (item, type) => {
        const _path = relativePath.concat("/", item)    
        if (type === 'folder') {
            setRelativePath(_path);
        }
        if (type === 'file') {
            preLoadFile(_path);
            //loadFile(path);
        }
    }

    const backOneDirectory = () => {
        if (relativePath === 'data') return;
        const last_slash_pos = relativePath.lastIndexOf('/');
        const path = relativePath.slice(0,last_slash_pos);
        setRelativePath(path)
    }

    const refreshBrowser = async() => {
        setPathInfo(await APIDataService.getPathQuery(relativePath));
    }

    const preLoadFile = (_path) => {
        setShowModal(true);
        setPath(_path);
    }

    const loadFile = async () => {
        //dispatch({ type:ActionTypes.SET_SIDENAV_SHOW, show: false })
        await APIDataService.addFiles(path, filename);
        let files = await APIDataService.getFiles();
        dispatch({ type:ActionTypes.SET_FILES, files });
        onSelect();
    }

    const handleFileLoad = async () => {
        setPath(pathInfo.path);
        preLoadFile(pathInfo.path);
        //loadFile(pathInfo.path);
    }

    return (
    <div className='file-browser'> 
        <label> File Browser </label>
        <FileBrowserControls onLoad={handleFileLoad} onRefresh={refreshBrowser} onBack={backOneDirectory}></FileBrowserControls>
        <FileBrowserPath path={relativePath}></FileBrowserPath>
        <div className='file-browser-list'>
            {
                pathInfo.folders.map((item, index)=> <FileBrowserItem key={index} item={item} type={'folder'} onSelect={handleFileItemSelect}></FileBrowserItem>)
            }

            {
                pathInfo.files.map((item, index)=> <FileBrowserItem key={index} item={item} type={'file'} onSelect={handleFileItemSelect}></FileBrowserItem>)
            }
        </div>
        <FileNamingModal showModal={showModal} setShowModal={setShowModal} filename={filename} setFilename={setFilename} loadFile={loadFile}></FileNamingModal>
    </div>
    )
}

export default FileBrowser;