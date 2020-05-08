import React, { useContext, useEffect } from 'react';
import Draggable from 'react-draggable';
import { GraphContext } from '../contexts/GraphContext';
import { NodeType } from './NodeCompute';
import nj from 'numjs';

const NodeInputs = (props) => <div className="node_input flex-50"> 
  { 
    props.node.inputLabels.map((item, index) => {
      return <div key={index} className="node_io-item layout-row flex"> 
          <div className="node_io-point"></div> 
          <div className="node_io-text flex"> {item} </div>
      </div>
    }) 
  }
</div>

const NodeOutput = (props) => <div className="node_output flex-50"> 
  { 
    props.node.outputLabels.map((item, index) => {
      return <div key={index} className="node_io-item layout-row flex"> 
          <div className="node_io-text flex"> {item} </div>
          <div className="node_io-point"></div> 
      </div>
    }) 
  }
</div>

const NodeIO = (props) => <div className="node_io layout-row flex" > 
    <NodeInputs node={props.node}></NodeInputs>
    <NodeOutput node={props.node}></NodeOutput>
</div>

const NodeTitle = (props) => <div className="node_title"> {props.name} </div>

const NodeProps = (props) => {

  const NodeButton = () => {
    return (
      <div className="layout-row layout-vertical-center layout-space-between flex"> 
        <label>Load:</label> 
        <button onClick={props.node.onLoad}> Select Image </button>
      </div>
    )
  }
  
  const show = props.node.nodeType == NodeType.IMAGE;

  return (
    <div className="node_props"> 
      { show ? <input type="file" onChange={props.node.onFileInput} /> : "" }
    </div>
  )
}

class Canvas extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    //this.props.node.drawMockImage(this.refs.canvas);
  }

  componentDidUpdate(prevProps) {
    if(this.props.node.nodeType == NodeType.IMAGE) {
      if(this.props.image != null && this.props.image !== prevProps.image)
        this.props.node.drawImage(this.refs.canvas);
    }
    else {
      if(this.props.data != null && this.props.data !== prevProps.data)
        this.props.node.drawDataToCanvas(this.refs.canvas);
    }
  }

  render() {
    return(
      <div>
        <canvas id='image-canvas' ref="canvas" width={180} height={180} />
      </div>
    )
  }
}

const NodeImage = (props) => <div className='node_image'> 
    <Canvas node = { props.node } image = { props.node.image } data = { props.node.data } ></Canvas>
</div>

/** React component representing a Node in a computation graph. */
const NodeUI = (props) => {
  
  const { setUpdateLinks, setUpdateNodes, setUpdateSession } = useContext(GraphContext);
  
  useEffect(() => { 
    props.node.update = { nodes: setUpdateNodes, session:setUpdateSession }
  }, [])

  const onControlledDrag = (e, position) => {
    const {x, y} = position;
    props.node.position.x = x;
    props.node.position.y = y;
    setUpdateLinks();
  };

  const onControlledDragStop = (e, position) => {
    onControlledDrag(e, position);
    setUpdateLinks();
  };
  
  const handleContextMenu = e => { 
    event.preventDefault();
    props.handleContextMenu(e, { node:props.node, link:null });
  }
  
  return (<Draggable
      handle=".node_title"
      position= { props.node.position } 
      grid={[25, 25]}
      onDrag={onControlledDrag}
      onStop={onControlledDragStop}>
      <div className='node' onContextMenu={handleContextMenu}>
        <NodeTitle name = { props.node.name }></NodeTitle>
        <NodeIO node = { props.node }></NodeIO>
        <NodeProps node = { props.node }></NodeProps>
        <NodeImage node = { props.node }></NodeImage>
      </div>
    </Draggable>
  );
}

export default NodeUI; 
