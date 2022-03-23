
class Project {
 
    static save(graph) {
        graph.updatedAt = (new Date()).getTime();

        let projects = JSON.parse(localStorage.getItem('saved-projects'));
        projects = projects ? projects : {};

        projects[graph.id] = graph;
        localStorage.setItem('saved-projects', JSON.stringify(projects));
    }

    static load() {
        let projects = JSON.parse(localStorage.getItem('saved-projects'));
        projects = projects ? projects : {};
        return Object.values(projects);
    }

    static deleteSave(graph) {
        let projects = JSON.parse(localStorage.getItem('saved-projects'));
        projects = projects ? projects : {};
        delete projects[graph.id];
        localStorage.setItem('saved-projects', JSON.stringify(projects));
    }
}

export default Project;