import './InspectorInfo.scss';
import { useContext } from 'react';
import AppState from '../../state/AppState';
import NodeList from '../../models/NodeList';
import ReactMarkdown from "react-markdown";

const InspectorInfo = () => {
    const {state} = useContext(AppState.AppContext);

    const nodeType = state.activeElement?.type;
    const detail = NodeList.getNode(nodeType)?.detail;

    return (
        <div className='inspector-info'> 
            <ReactMarkdown children={detail} />    
        </div>     
    );

}

export default InspectorInfo;