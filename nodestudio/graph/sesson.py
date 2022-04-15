import time
import graph

class Session:

    def run(operations):
        ''' Run a compute session for an input operation '''
        print('Run Sesson')

        start = time.time()

        computed = []
        for operation in operations:
            node = graph.current_graph.getNode(operation)
            order = Session.compute_order(node)
            for node in order:
                if node.id not in computed:
                    node.compute()
                    computed.append(node.id)

        process_time = (time.time() - start) * 1000     # Processed time in ms

        print('Sesson Complete')
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