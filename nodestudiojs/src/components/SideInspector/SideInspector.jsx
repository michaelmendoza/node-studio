
import Tabs from '../shared/Tabs';
import NodeInspector from '../shared/NodeInspector';
import InspectorInfo from './InspectorInfo';

const SideInspector = () => {

    return (
        <Tabs tabnames={['Inspector', 'Info']}>
            <NodeInspector></NodeInspector>
            <InspectorInfo></InspectorInfo>
        </Tabs>
    )
}

export default SideInspector