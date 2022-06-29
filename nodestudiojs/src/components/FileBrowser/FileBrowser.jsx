//menu bar
//close button
//current working directory
//entries in the current working directory
    //files - icon, name, extension, size
    //directories - icon, name

import { useEffect, useState } from 'react';
import APIDataService from '../../services/APIDataService';
import CurrentWorkingDirectory from './CurrentWorkingDirectory';
import DirectoryControls from './DirectoryControls';
import './FileBrowser.scss';
import FileItem from './FileItem';

const FileBrowser = ({file}) => {
    const [files, setFiles] = useState([]);
    const [currentDirectory, setCurrentDirectory] = useState('');
    useEffect(()=>{
        const fetch = async() => {
            const data = APIDataService.getCurrentDirectoryEntries();
            setFiles(data);
        }
        fetch()
    },[currentDirectory])
    return (
    <div className='file_browser'>
        {/* <DirectoryControls setCurrentDirectory={setCurrentDirectory}></DirectoryControls>
        <CurrentWorkingDirectory currentDirectory={currentDirectory}></CurrentWorkingDirectory>
        {
            files.map((file)=> <FileItem file={file} setCurrentDirectory={setCurrentDirectory}></FileItem>)
        } */}
    </div>
    )

}

export default FileBrowser;