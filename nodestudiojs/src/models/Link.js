
class Link {

    constructor(link) {
        this.id = link.id || crypto.randomUUID();                 // UUID for link
        this.startNode = link.startNode;
        this.startPort = link.startPort;
        this.endNode = link.endNode;
        this.endPort = link.endPort;
    }

    /** Exports link to format need for saving / backend */
    static export(link) {
        const data = {
            id: link.id,
            startNode: link.startNode,
            startPort: link.startPort,
            endNode: link.endNode,
            endPort: link.endPort
        }
        return data;
    }

}

export default Link;