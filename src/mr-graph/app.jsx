import React from 'react';
import { Graph } from '.';

const SideNavItem = (props) => {
  return (
    <div className="sidenav-item"> 
      <div className="sidenav-icon">
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

const App = () => (
    <section className='app'>  
      <SideNav></SideNav>
      <MainView>
        <Graph></Graph>    
      </MainView>
    </section>
);

export default App; 