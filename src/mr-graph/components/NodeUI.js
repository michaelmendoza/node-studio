import React, { useContext } from 'react';
import Draggable from 'react-draggable';
import { GraphContext } from '../contexts/GraphContext';

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

const NodeProps = (props) => <div> </div>

class Canvas extends React.Component {
  componentDidMount() {
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")

    var img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    }
    img.src = 'https://picsum.photos/200/200';
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
    <Canvas></Canvas>
</div>

var nodeUICount = 0;

/** React component representing a Node in a computation graph. */
const NodeUI = (props) => {

  //const { drawLinks, setDrawLinks } = useContext(GraphContext);
  
  nodeUICount++;

  const onControlledDrag = (e, position) => {
    const {x, y} = position;
    props.node.position.x = x;
    props.node.position.y = y;
    //setDrawLinks(true);
  };

  const onControlledDragStop = (e, position) => {
    onControlledDrag(e, position);
    //setDrawLinks(false);
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
}

export default NodeUI;
