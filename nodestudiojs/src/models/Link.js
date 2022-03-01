
class Link {

    constructor(node) {
        this.id = node.id || crypto.randomUUID();                 // UUID for link
        this.startNode = node.startNode;
        this.endNode = node.endNode;
    }

}

export default Link;