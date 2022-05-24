import './StatusModal.scss';
import { LoadingSpinner } from "../base/Loading";
import { useEffect, useState } from 'react';
import { useAppState } from "../../state/AppState";

const StatusModal = () => {
    const { state } = useAppState();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const status = state?.websocket?.status === 'compute' || state?.websocket?.status === 'error'
        setShow(status);
    }, [state.websocket])

    const handleOnClose = () => {
        setShow(false);
    }

    const status = state?.websocket?.status;
    const message = state?.websocket?.message;
    const error =  state?.websocket?.error;
    const nodeid = state?.websocket?.nodeid;
    const node = nodeid ? state.nodes[nodeid] : undefined;

    return (
        <div>
            { 
                show ? <div className='status-modal layout-center'>
                <div className='status-backdrop'></div>
                <div className='status-container'>
                    <div className={ 'status-header ' + (status === 'error' ? 'status-error' : '') + ' layout-center layout-space-between'}> 
                        <h2> { status } </h2>
                        { status === 'error' ? <button className='button-icon' onClick={handleOnClose}> <i className="material-icons" >close</i> </button> : null }
                    </div>

                    {
                        status === 'compute' ?  <div className='status-content layout-column'>
                            <LoadingSpinner></LoadingSpinner> 
                            <label> { message } </label>
                        </div> : null 
                    }

                    { 
                        status === 'error' ?  <div className='status-content text-align-left' style={{ width: '600px'}}>

                            { 
                                nodeid ? <div>
                                    <label> Compute Error: { node?.props?.type } Node </label>
                                    <label> Node ID: { node?.id } </label>
                                </div> : null 
                            }

                            <label> Error Message: { error } </label>
                        </div> : null 
                    }
                </div>
            </div> : null 
            }
        </div>
    )
}

export default StatusModal;