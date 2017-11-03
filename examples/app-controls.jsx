import React from 'react';

import AppStore from './app-store.js';

class AppControls extends React.Component {

	handleAddNode() {
		AppStore.addNode(this);
	}

	handlePlayGraph() {
		AppStore.runGraph();
		var query = AppStore.queryGraph();
	}

	render() {
		return (
			<section className='app-controls'>  
				<div className="icon-button" onClick={this.handlePlayGraph}><i className="material-icons">play_arrow</i></div>
				<div className="icon-button"><i className="material-icons">save</i></div>
				<div className="icon-button"><i className="material-icons">folder_open</i></div>
				<div className="divider"></div>				<div className="icon-button" onClick={this.handleAddNode.bind('image')}><i className="material-icons">photo</i></div>
				<div className="icon-button" onClick={this.handleAddNode.bind('add')}><i className="material-icons">add_box</i></div>
				<div className="icon-button" onClick={this.handleAddNode.bind('fit')}><i className="material-icons">timeline</i></div>
				<div className="icon-button" onClick={this.handleAddNode.bind('histogram')}><i className="material-icons">insert_chart</i></div>
				<div className="icon-button" onClick={this.handleAddNode.bind('custom')}><i className="material-icons">code</i></div>
				<div className="icon-button" onClick={this.handleAddNode.bind('view')}><i className="material-icons">pageview</i></div>
			</section>
		);
	}
}

export default AppControls;
