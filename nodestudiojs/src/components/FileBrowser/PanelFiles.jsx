import { useContext, useState } from 'react';
import AppState from '../../state/AppState';
import APIDataService from '../../services/APIDataService';
import Table from '../base/Table';
import { useEffect } from 'react';
import FileBrowser from '../FileBrowser/FileBrowser';

const PanelFiles = () => {
    const { state, dispatch } = useContext(AppState.AppContext);
    const [showFileBrowser, setShowFileBrowser] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            for (let i = 0; i < state.files.length; i++) {
                if(!state.files[i].img) {
                    const imgSrc = await APIDataService.getFilePreview(state.files[i].id);
                    state.files[i].img = imgSrc;
                }
            }
        }
        fetch();
    }, [state.files])

    const AvailableFilesList = () =>  <div className='available-files-list'>
        <label> Available Files </label>
        <Table data={files} headers={['Preview','Name', 'Type']}></Table>
    </div>

    const files = state.files.map(file => [{ img: file.img, style:{width:'64px'} }, file.name, file.type]);

    return (
        <div className='panel-files'>
            <div className='layout-row-center layout-space-between'>
                <h2> Files </h2>
            </div>

            { showFileBrowser ? <FileBrowser onSelect={()=> setShowFileBrowser(false)}></FileBrowser> : <AvailableFilesList></AvailableFilesList> }
        </div>
    )
}

export default PanelFiles;