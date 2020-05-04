import React, { Component, createContext } from 'react';

export const GraphContext = createContext();

class GraphContextProvider extends Component {

    state = {
        nodes:[],
        links:[],
        updateLinks:0,
        updateNodes:0,
        updateSession:0
    }
    
    setUpdateLinks = () => { this.setState({ updateLinks: this.state.updateLinks + 1 })}
    setUpdateNodes = () => { this.setState({ updateNodes: this.state.updateNodes + 1 }); console.log("UpdateNodes: ", this.state.updateNodes); }
    setUpdateSession = () => { this.setState({ updateSession: this.state.updateSession + 1 }); console.log("UpdateSession: ", this.state.updateSession); }
    addNode = (node) => { this.setState({ nodes:[...this.state.nodes, node] })}
    setNodes = (nodes) => { this.setState({ nodes:nodes })}
    addLink = (link) => { this.setState({ links:[...this.state.links, link] })}
    setLinks = (links) => { this.setState({ links:links })}
    
    render() {
        return (
            <GraphContext.Provider value={{...this.state, 
                setUpdateLinks:this.setUpdateLinks,
                setUpdateNodes:this.setUpdateNodes,
                setUpdateSession:this.setUpdateSession,
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