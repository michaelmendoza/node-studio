import './InspectorInfo.scss';
import { useContext } from 'react';
import AppState from '../../state/AppState';
import NodeList from '../../models/NodeList';
import ReactMarkdown from "react-markdown";
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css';


const InspectorInfo = () => {

    const {state} = useContext(AppState.AppContext);
    const nodeType = state.activeElement?.type;
    const detail = NodeList.getNode(nodeType)?.detail;

    return (
        <div className='inspector-info'> 
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} children={detail} />    

        </div>     
    );

}

export default InspectorInfo;