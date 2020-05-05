import React from 'react';
import { Graph } from '.';
import GraphContextProvider from './contexts/GraphContext';

const SideNavItem = (props) => {
  const handleDragEnd = (e) => {
    if (e.stopPropagation) {
      e.stopPropagation(); // stops the browser from redirecting.
    }
    console.log("SideNav - DragEnd");
    return false;
  }
  
  return (
    <div className="sidenav-item"> 
      <div className="sidenav-icon" draggable="true" onDragEnd={handleDragEnd}>
        <div> <i className="material-icons">{props.icon}</i> </div>
        <div> <label> {props.name} </label> </div>
      </div>
    </div> 
  )
}

const SideNav = () => {
  return (
    <nav className='sidenav'>  
      <SideNavItem icon={"photo"} name={"Image"}></SideNavItem>
      <SideNavItem icon={"add_box"} name={"Add"}></SideNavItem>
      <SideNavItem icon={"timeline"} name={"Fit"}></SideNavItem>
      <SideNavItem icon={"insert_chart"} name={"Stats"}></SideNavItem>
      <SideNavItem icon={"pageview"} name={"Display"}></SideNavItem>
    </nav>
  )
}

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
      <Header></Header>
      <SideNav></SideNav>
      <MainView>
        <GraphContextProvider>
          <Graph></Graph>   
        </GraphContextProvider>
      </MainView>
    </section>
);

export default App; 