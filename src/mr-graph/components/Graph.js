import React from 'react';
import Links from './Links';
import Nodes from './Nodes';
import GraphContextProvider from '../contexts/GraphContext';

/** Computation Graph */
const Graph = () => { 
    // { drawLinks.toString() } <button onClick={handle}></button>  

    return (
      <div className="node-graph">  
        <GraphContextProvider>
            <Nodes></Nodes> 
            <Links></Links>
        </GraphContextProvider>
      </div>
    );
  } 
  
  export default Graph;
