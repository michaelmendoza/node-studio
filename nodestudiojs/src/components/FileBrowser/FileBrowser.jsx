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
    const [showFileNamingModal, setShowFileNamingModal] = useState(false);

    const handleFileNaming = () => {
        setShowFileNamingModal(true);
    }

    useEffect(()=>{
        const fetch = async() => {
            let data = await APIDataService.getPathQuery(relativePath);
            if (data) setPathInfo(data);
            else data = { path:'', folders:[], files:[] };
        }

        fetch();
    },[relativePath])

    const handleFileItemSelect = (item, type) => {
        const path = relativePath.concat("/", item)    
        if (type === 'folder') {
            setRelativePath(path);
        }
        if (type === 'file') {
            loadFile(path);
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

    const loadFile = async (path) => {
        //dispatch({ type:ActionTypes.SET_SIDENAV_SHOW, show: false })
        await APIDataService.addFiles(path);
        let files = await APIDataService.getFiles();
        dispatch({ type:ActionTypes.SET_FILES, files });
        onSelect();
    }

    const handleFileLoad = async () => {
        setShowFileNamingModal(true);
        loadFile(pathInfo.path);
    }

    return (
    <div className='file-browser'> 
        <label> File Browser </label>
        <FileBrowserControls onLoad={handleFileLoad} onRefresh={refreshBrowser} onBack={backOneDirectory}></FileBrowserControls>
        <FileBrowserPath path={relativePath}></FileBrowserPath>
        <FileNamingModal showFileNamingModal={showFileNamingModal} setShowFileNamingModal={setShowFileNamingModal}></FileNamingModal>
        <div className='file-browser-list'>
            {
                pathInfo.folders.map((item, index)=> <FileBrowserItem key={index} item={item} type={'folder'} onSelect={handleFileItemSelect}></FileBrowserItem>)
            }

            {
                pathInfo.files.map((item, index)=> <FileBrowserItem key={index} item={item} type={'file'} onSelect={handleFileItemSelect}></FileBrowserItem>)
            }
        </div>
    </div>
    )
}

export default FileBrowser;