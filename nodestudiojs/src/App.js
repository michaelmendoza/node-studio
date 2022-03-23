import 'normalize.css';
import './styles/app.scss';
import './App.scss';
import React, { useContext, useEffect } from 'react';
import { ActionTypes, AppContext } from './state';
import AppState from './state/AppState';
import APIDataService from './services/APIDataService';
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
import Graph from './models/Graph';

const AppComponents = () => {
    const {dispatch} = useContext(AppContext);

    useEffect(() => {
        NodeList.fetch();
        
        const fetch = async () => {
            const json_string = await APIDataService.getGraph();
            const graphData = Graph.readJson(json_string);
            dispatch({ type:ActionTypes.INIT_GRAPH, graph:graphData });
        }
        fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='app-components'>
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
        </div>
    );
}

function App() {

    return (
        <div className="App">
            <AppState.AppStateProvider>
                <AppComponents></AppComponents>
            </AppState.AppStateProvider>
        </div>
    );
}

export default App;
