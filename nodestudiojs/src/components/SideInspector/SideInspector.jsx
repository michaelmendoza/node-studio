import './SideInspector.scss';
import Tabs from '../shared/Tabs';
import NodeInspector from './NodeInspector';
import InspectorInfo from './InspectorInfo';
import Divider from '../base/Divider';

const SideInspector = () => {

    return (
        <div className='side-inspector'>
            <div style={{ padding:'1em'}}>
                <span style={{ borderBottom: '1px solid #545d6e', color: '#E0E0E0' }}> Inspector </span>
                <Divider></Divider>
                <NodeInspector></NodeInspector>
            </div>
            {
                /*
            <Tabs tabnames={['Inspector', 'Info']}>
                <NodeInspector></NodeInspector>
                <InspectorInfo></InspectorInfo>
            </Tabs>
                */
            }
        </div>
    )
}

export default SideInspector