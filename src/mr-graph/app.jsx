import React from 'react';
import { Graph } from '.';
import SideNav from './components/SideNav';
import GraphContextProvider from './contexts/GraphContext';

const MainView = (props) => {
  return (
    <div className="main-view">
      {props.children}
    </div>
  )
}

const Header = () => {
  return (
    <header className="header">
      <h2> Image Graph </h2>
    </header>
  )
}

const App = () => (
  <section className='app'>  
    <GraphContextProvider>
      <Header></Header>
      <SideNav></SideNav>
      <MainView>
        <Graph></Graph>   
      </MainView>
    </GraphContextProvider>
  </section>
);

export default App; 