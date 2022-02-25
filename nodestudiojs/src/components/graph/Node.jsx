import React from 'react';
import Draggable from 'react-draggable';

import './Node.scss';

/**
 * Component for node input ports
 */
const NodeInputs = ({inputs}) => <div className="node_input flex-50"> 
    { 
        inputs.map((item, index) => {
            return <div key={index} className="node_io-item layout-row flex"> 
                <div className="node_io-point"></div> 
                <div className="node_io-text flex"> {item} </div>
            </div>
    }) 
    }
</div>

/**
 *  Component for node output ports
 */
const NodeOutput = ({outputs}) => <div className="node_output flex-50"> 
    {
        outputs.map((item, index) => {
            return <div key={index} className="node_io-item layout-row flex"> 
                <div className="node_io-text flex"> {item} </div>
                <div className="node_io-point"></div> 
            </div>
        }) 
    }
</div>

/**
 * Contains Input and Output ports IU
 */
const NodeIO = ({inputs, outputs}) => <div className="node_io layout-row flex" > 
    <NodeInputs inputs={inputs}></NodeInputs>
    <NodeOutput outputs={outputs}></NodeOutput>
</div>

/**
 * Node Title Text
 */
const NodeTitle = ({name}) => <div className="node_title"> {name} </div>

/**
 * Node Property Options
 */
const NodeProps = ({props}) => {

  return (
    <div className="node_props"> 

    </div>
  )
}

/**
 * Node Component representing a Node in a computation graph
 */
const Node = ({node, onNodeMove, onContextMenu}) => {

    const onStart = () => {
        onNodeMove(true);
    }

    const onControlledDrag = (e, position) => {
        e.preventDefault();
        const {x, y} = position;
        node.position.x = x;
        node.position.y = y;
        console.log(node);
        //setUpdateLinks();
      };
    
      const onControlledDragStop = (e, position) => {
        onControlledDrag(e, position);
        onNodeMove(false);
        //setUpdateLinks();
      };

    const handleContextMenu = e => { 
        e.preventDefault();
        //handleContextMenu(e, { node:node, link:null });
    }

    return (
        <Draggable handle=".node_title" position={node?.position} grid={[25, 25]} onStart={onStart} onDrag={onControlledDrag} onStop={onControlledDragStop}>
            <div>
                <div className='node' onContextMenu={handleContextMenu}>
                    <NodeTitle {...node}></NodeTitle>
                    <NodeIO {...node} ></NodeIO>
                    <NodeProps {...node}></NodeProps>
                </div>
            </div>
        </Draggable>
    )
}

export default Node;