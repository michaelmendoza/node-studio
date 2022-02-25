import graph

class Session:

    def run(operation):
        ''' Run a compute session for an input operation '''
        print('Run Sesson')

        order = Session.compute_order(operation)
        for node in order:
            node.compute()

        print('Sesson Complete')
        return operation.value

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