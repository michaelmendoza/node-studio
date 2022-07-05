import time
import graph
from api import websocket

class Session:

    async def run(id, operations):
        ''' Run a compute session for an input operation '''

        print('Run Sesson')
        await websocket.manager.emit('status', { 'session_id':id, 'status':'compute', 'message':'Computing Nodes ...' })

        start = time.time()

        to_compute = []
        for operation in operations:
            node = graph.current_graph.getNode(operation)
            order = Session.compute_order(node)
            for index, node in enumerate(order):
                if node.id not in to_compute:
                    to_compute.append(node.id)

        computed = []
        for index, nodeID in enumerate(to_compute):
            node = graph.current_graph.node_dict[nodeID]
            if node.id not in computed:
                node_start = time.time()
                node.compute()
                computed.append(node.id)
                node_process_time = (time.time() - node_start) * 1000
                await websocket.manager.emit('status', {'session_id':id, 'status':'compute', 'message': f'Node {index+1} of {len(to_compute)} Computed', 'time': node_process_time, 'id': node.id, 'name': node.props.type.name })

        process_time = (time.time() - start) * 1000     # Processed time in ms

        print('Sesson Complete')
        await websocket.manager.emit('status', { 'session_id':id, 'status':'end', 'message':'Computation complete', 'time': process_time })

        return { 'time': round(time.time() * 1000), 'process_time': process_time, 'nodes_computed': [ node for node in computed ] }

    def compute_order(start_node):
        ''' Compute traversal order for nodes for a given node '''
        order = []

        def recurse(node):
            for input in node.inputs:
                input_node = graph.current_graph.node_dict[input]
                recurse(input_node)
            order.append(node)

        recurse(start_node)
        return order