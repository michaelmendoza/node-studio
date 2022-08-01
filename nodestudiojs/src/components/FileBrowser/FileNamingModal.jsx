import './FileNamingModal.scss';
import { useEffect, useState } from 'react';
import { useAppState } from "../../state/AppState";
import Modal from '../base/Modal';

const FileNamingModal = () => {
    const { state } = useAppState();
    const [filename, setFilename] = useState('');

    const handleFileNaming = () => {
        setFilename('');
    }

    return (
        <Modal title='Name File' open={showFileNamingModal} onClose={() => setShowFileNamingModal(!showFileNamingModal)}>
            <div className='file-naming-modal'>
                <TextInput name="Enter file name" value={filename} onChange={(e) => setFilename(e.target.value)}></TextInput>
                <div className='layout-row-center'>
                    <button onClick={handleFileNaming}>Save</button>
                </div>
            </div>
        </Modal>
    )

}

export default FileNamingModal;