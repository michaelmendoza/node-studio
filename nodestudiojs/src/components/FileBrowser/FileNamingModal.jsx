import './FileNamingModal.scss';
import { useEffect, useState } from 'react';
import { useAppState } from "../../state/AppState";

const FileNamingModal = () => {
    const { state } = useAppState();
    const [show, setShow] = useState(false);

    return (
        <div>
            { 
                show ? <div className='file-naming-modal layout-center'>
                <div className='file-naming-backdrop'></div>
                <div className='file-naming-container'>
                    <div className={ 'file-naming-header' }> 
                        <h2> Name the file </h2>
                    </div>
                    <div className={ 'file-naming-content' }>
                    <div>
                        <input type="text" name="file_name" placeholder={'Enter File Name'} />
                    </div>
                    </div>
                </div>
            </div> : null 
            }
        </div>
    )

}

export default FileNamingModal;