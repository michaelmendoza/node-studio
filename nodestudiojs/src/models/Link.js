
class Link {

    constructor(link) {
        this.id = link.id || crypto.randomUUID();                 // UUID for link
        this.startNode = link.startNode;
        this.startPort = link.startPort;
        this.endNode = link.endNode;
        this.endPort = link.endPort;
    }

}

export default Link;