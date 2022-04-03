import './NodeIO.scss';

/**
 * Component for node input ports
 */
const NodeInputs = ({inputs}) => <div className="node_input flex-50"> 
    { 
        inputs.map((item, index) => {
            return <div key={index} className="node_io-item layout-row-center flex"> 
                <div className="node_io-point"></div> 
                <div className="node_io-text flex"> {item} </div>
            </div>
    }) 
    }
</div>

/**
 *  Component for node output ports
 */
const NodeOutput = ({outputs}) => {
    return (
        <div className="node_output flex-50"> 
            {
                outputs.map((item, index) => {
                    return <div key={index} className="node_io-item layout-row-center flex"> 
                        <div className="node_io-text flex"> {item} </div>
                        <div className="node_io-point"></div> 
                    </div>
                }) 
            }
        </div>
    )
} 

/**
 * Contains Input and Output ports IU
 */
const NodeIO = ({inputLabels, outputLabels}) => <div className="node_io layout-row flex" > 
    <NodeInputs inputs={inputLabels}></NodeInputs>
    <NodeOutput outputs={outputLabels}></NodeOutput>
</div>

export default NodeIO;