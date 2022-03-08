
class Link {

    constructor(link) {
        this.id = link.id || crypto.randomUUID();                 // UUID for link
        this.startNode = link.startNode;
        this.endNode = link.endNode;
    }

}

export default Link;