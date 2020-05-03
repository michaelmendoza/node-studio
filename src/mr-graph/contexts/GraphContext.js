import React, { Component, createContext } from 'react';

export const GraphContext = createContext();

class GraphContextProvider extends Component {

    state = {
        nodes:[],
        links:[],
        drawLinks:false
    }
    
    setDrawLinks = (doDraw) => { this.setState({ drawLinks: doDraw })}
    addNode = (node) => { this.setState({ nodes:[...this.state.nodes, node]})}
    setNodes = (nodes) => { this.setState({ nodes:nodes })}
    addLink = (link) => { this.setState({ links:[...this.state.links, link]})}

    render() {
        return (
            <GraphContext.Provider value={{...this.state, 
                setDrawLinks:this.setDrawLinks,
                addNode:this.addNode,
                setNodes:this.setNodes,
                addLink:this.addLink}}>
               {this.props.children} 
            </GraphContext.Provider>
        )
    }
}

export default GraphContextProvider; 