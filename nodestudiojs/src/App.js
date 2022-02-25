import 'normalize.css';
import './styles/app.scss';
import './App.scss';
import Viewport from './components/layout/Viewport';
import LoadGraph from './components/shared/LoadGraph';
import CenterView from './components/layout/CenterView';
import SideView, { SideViewPositions } from './components/layout/SideView';
import BottomView from './components/layout/BottomView';
import AppHeader from './components/layout/AppHeader';
import SideNav from './components/shared/SideNav';
import Tabs from './components/shared/Tabs';
import NodeInspector from './components/shared/NodeInspector';
import AppState from './state/AppState';

function App() {
    return (
        <div className="App">
            <AppState.AppStateProvider>
                <AppHeader></AppHeader>
                <section>
                    <CenterView></CenterView>
                    <SideView position={SideViewPositions.LEFT}>
                        <SideNav></SideNav>
                    </SideView>
                    <SideView position={SideViewPositions.RIGHT}>
                        <Tabs tabnames={['Inspector', 'Info']}>
                            <NodeInspector></NodeInspector>
                            <div> Info </div>
                        </Tabs>
                    </SideView>
                    <BottomView></BottomView>
                </section>
            </AppState.AppStateProvider>
        </div>
    );
}

export default App;
