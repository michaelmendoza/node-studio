import React, { useEffect, useContext } from 'react';
import { GraphContext } from '../contexts/GraphContext';
import { NodeType } from './NodeCompute';

const SideNavItem = (props) => {
  const { setCreateNodeType } = useContext(GraphContext);
  
  const handleDragStart = (e) => {
    e.stopPropagation(); 
    setCreateNodeType(props.type);
    console.log("SideNav - DragStart", props.type);
  }
    
  return (
    <div className="sidenav-item"> 
      <div className="sidenav-icon" draggable="true" onDragStart={handleDragStart}>
        <div> <i className="material-icons">{props.icon}</i> </div>
        <div> <label> {props.name} </label> </div>
      </div>
    </div> 
  )
}
  
const SideNav = () => {
  return (
    <nav className='sidenav'>  
      <SideNavItem icon={"photo"} name={"Image"} type={NodeType.IMAGE}></SideNavItem>
      <SideNavItem icon={"add_box"} name={"Add"} type={NodeType.ADD}></SideNavItem>
      <SideNavItem icon={"timeline"} name={"Fit"} type={NodeType.FIT}></SideNavItem>
      <SideNavItem icon={"insert_chart"} name={"Stats"} type={NodeType.MASK}></SideNavItem>
      <SideNavItem icon={"pageview"} name={"Display"} type={NodeType.DISPLAY}></SideNavItem>
    </nav>
  )
}

export default SideNav;