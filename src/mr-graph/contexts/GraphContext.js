import React, { Component, createContext } from 'react';
import { CreateNode } from '../components/Nodes';
import { NodeType } from '../components/NodeCompute';
import { removeLink } from '../components/Links';

export const GraphContext = createContext();

class GraphContextProvider extends Component {

    state = {
        nodes:[],
        links:[],
        updateLinks:0,
        updateNodes:0,
        updateSession:0,
        createNodeType: NodeType.IMAGE
    }
    
    addNode = (node) => { this.setState({ nodes:[...this.state.nodes, node] })}
    createNode = (type, x, y) => { this.setState({ nodes:[...this.state.nodes, CreateNode(type, x, y)()] })}
    setNodes = (nodes) => { this.setState({ nodes:nodes })}
    deleteNode = (node) => { this.setState({ nodes: this.state.nodes.filter(n => n !== node)})} 
    addLink = (link) => { this.setState({ links:[...this.state.links, link] })}
    setLinks = (links) => { this.setState({ links:links })}
    deleteLink = (link) => { this.setState({ links: this.state.links.filter(l => l !== link)}); removeLink(link); } 
    setUpdateLinks = () => { this.setState({ updateLinks: this.state.updateLinks + 1 })}
    setUpdateNodes = () => { this.setState({ updateNodes: this.state.updateNodes + 1 }); console.log("UpdateNodes: ", this.state.updateNodes); }
    setUpdateSession = () => { this.setState({ updateSession: this.state.updateSession + 1 }); console.log("UpdateSession: ", this.state.updateSession); }
    setCreateNodeType = (nodeType) => { this.setState({ createNodeType: nodeType })}
    
    render() {
        return (
            <GraphContext.Provider value={{...this.state, 
                addNode:this.addNode,
                createNode:this.createNode,
                setNodes:this.setNodes,
                deleteNode:this.deleteNode,
                addLink:this.addLink,
                setLinks:this.setLinks,
                deleteLink:this.deleteLink,
                setUpdateLinks:this.setUpdateLinks,
                setUpdateNodes:this.setUpdateNodes,
                setUpdateSession:this.setUpdateSession,
                setCreateNodeType:this.setCreateNodeType
            }}>
               {this.props.children} 
            </GraphContext.Provider>
        )
    }
}

export default GraphContextProvider; 