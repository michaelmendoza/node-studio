import React, { useContext, useEffect } from 'react';
import Draggable from 'react-draggable';
import { GraphContext } from '../contexts/GraphContext';
import { NodeType } from './NodeCompute';

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
  const FileInput = () => {
    return (
      <div className="layout-row layout-vertical-center layout-space-between flex"> 
        <input type="file" onChange={props.node.onFileInput} />
      </div>
    )
  }

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
      { show ? <FileInput></FileInput> : "" }
    </div>
  )
}

class Canvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.drawMockImg();
  }

  componentDidUpdate() {
    if(this.props.image != null)
      this.drawImg();
  }

  drawMockImg() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")

    var img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    }
    img.src = 'https://picsum.photos/200/200';
  }

  drawImg() {
    console.log('Redraw');
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")

    var img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    }
    img.src = this.props.image;
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
    <Canvas image = { props.node.image }></Canvas>
</div>

/** React component representing a Node in a computation graph. */
const NodeUI = (props) => {
  
  const { setUpdateNodes, setUpdateLinks } = useContext(GraphContext);
  
  useEffect(() => { props.node.update = setUpdateNodes }, [])

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
  
  return (<Draggable
      handle=".node_title"
      position= { props.node.position } 
      grid={[25, 25]}
      onDrag={onControlledDrag}
      onStop={onControlledDragStop}>
      <div className='node'>
      <NodeTitle name = { props.node.name }></NodeTitle>
      <NodeIO node = { props.node }></NodeIO>
      <NodeProps node = { props.node }></NodeProps>
      <NodeImage node = { props.node }></NodeImage>
      </div>
    </Draggable>
  );
}

export default NodeUI;

/*
const NodeUI = (props) => {

  const { setUpdateLinks } = useContext(GraphContext);
  
  nodeUICount++;

  const onControlledDrag = (e, position) => {
    const {x, y} = position;
    props.node.position.x = x;
    props.node.position.y = y;
    //setUpdateLinks(true);
  };

  const onControlledDragStop = (e, position) => {
    onControlledDrag(e, position);
    //setUpdateLinks(false);
  };
  
  return (<Draggable key={nodeUICount}
      handle=".node_title"
      position= { props.node.position } 
      grid={[25, 25]}
      onDrag={onControlledDrag}
      onStop={onControlledDragStop}>
      <div className='node'>
      <NodeTitle name={ props.node.name }></NodeTitle>
      <NodeIO node={ props.node }></NodeIO>
      <NodeImage></NodeImage>
      </div>
    </Draggable>
  );
} */