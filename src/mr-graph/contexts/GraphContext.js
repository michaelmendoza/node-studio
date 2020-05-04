import React, { Component, createContext } from 'react';

export const GraphContext = createContext();

class GraphContextProvider extends Component {

    state = {
        nodes:[],
        links:[],
        updateLinks:0,
        updateNodes:0
    }
    
    setUpdateLinks = () => { this.setState({ updateLinks: this.state.updateLinks + 1 })}
    setUpdateNodes = () => { this.setState({ updateNodes:this.setState.updateNodes + 1 })}
    addNode = (node) => { this.setState({ nodes:[...this.state.nodes, node] })}
    setNodes = (nodes) => { this.setState({ nodes:nodes })}
    addLink = (link) => { this.setState({ links:[...this.state.links, link] })}
    setLinks = (links) => { this.setState({ links:links })}

    render() {
        return (
            <GraphContext.Provider value={{...this.state, 
                setUpdateLinks:this.setUpdateLinks,
                setUpdateNodes:this.setUpdateNodes,
                addNode:this.addNode,
                setNodes:this.setNodes,
                addLink:this.addLink,
                setLinks:this.setLinks}}>
               {this.props.children} 
            </GraphContext.Provider>
        )
    }
}

export default GraphContextProvider; 