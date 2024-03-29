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
import Console from './components/Console';
import NodeList from './models/NodeList';
import Examples from './models/Example';
import Graph from './models/Graph';
import SideInspector from './components/SideInspector';
import { createWebsocketServer } from './services/WebsocketService';
import StatusModal from './components/shared/StatusModal';

const AppComponents = () => {
    const {dispatch} = useContext(AppContext);

    useEffect(() => {
        createWebsocketServer(dispatch);
        NodeList.fetch();
        Examples.fetch();
        // Added call to cheek -> loaded files and load if needed 

        const fetch = async () => {
            const json_string = await APIDataService.getGraph();
            const graph = Graph.readJson(json_string);
            const metadata = await APIDataService.getGraphNodeViewMetadata();
            dispatch({ type:ActionTypes.INIT_GRAPH, graph, metadata });

            const files = await APIDataService.getFiles();
            dispatch({ type:ActionTypes.SET_FILES, files });
        }
        fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='app-components'>
            <AppHeader></AppHeader>
            <StatusModal></StatusModal>
            <section>
                <CenterView>
                    <GraphView></GraphView>
                </CenterView>
                <SideView position={SideViewPositions.LEFT}>
                    <SideNav></SideNav>
                </SideView>
                <SideView position={SideViewPositions.RIGHT}>
                    <SideInspector></SideInspector>
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
