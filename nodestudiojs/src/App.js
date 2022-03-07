import 'normalize.css';
import './styles/app.scss';
import './App.scss';
import { useEffect } from 'react';
import AppState from './state/AppState';
import CenterView from './components/layout/CenterView';
import GraphView from './components/graph/GraphView';
import SideView, { SideViewPositions } from './components/layout/SideView';
import BottomView from './components/layout/BottomView';
import AppHeader from './components/layout/AppHeader';
import SideNav from './components/SideNav';
import Tabs from './components/shared/Tabs';
import Console from './components/Console';
import NodeInspector from './components/shared/NodeInspector';
import NodeList from './models/NodeList';

function App() {
    useEffect(() => {
        NodeList.fetch();
    }, [])

    return (
        <div className="App">
            <AppState.AppStateProvider>
                <AppHeader></AppHeader>
                <section>
                    <CenterView>
                        <GraphView></GraphView>
                    </CenterView>
                    <SideView position={SideViewPositions.LEFT}>
                        <SideNav></SideNav>
                    </SideView>
                    <SideView position={SideViewPositions.RIGHT}>
                        <Tabs tabnames={['Inspector', 'Info']}>
                            <NodeInspector></NodeInspector>
                            <div> Info </div>
                        </Tabs>
                    </SideView>
                    <BottomView>
                        <Console></Console>
                    </BottomView>
                </section>
            </AppState.AppStateProvider>
        </div>
    );
}

export default App;
