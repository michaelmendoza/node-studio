import './SideInspector.scss';
import Tabs from '../shared/Tabs';
import NodeInspector from './NodeInspector';
import InspectorInfo from './InspectorInfo';

const SideInspector = () => {

    return (
        <div className='side-inspector'>
            <Tabs tabnames={['Inspector', 'Info']}>
                <NodeInspector></NodeInspector>
                <InspectorInfo></InspectorInfo>
            </Tabs>
        </div>
    )
}

export default SideInspector