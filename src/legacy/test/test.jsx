
import React from 'react';
import ReactDOM from 'react-dom';

//import AppControls from './app-controls.jsx';

import APIView from './api/api-view.jsx';
import GraphView from './graph/graph-view.jsx';

import EventEmitter from 'events';

class TestStore extends EventEmitter {
	constructor() {
		super()
		this.activeView = 'graph';
	}

	updateView(view) {
		this.activeView = view;
		this.emit('update');
	}
}
TestStore = new TestStore()

console.log('test', TestStore.activeView)

class Nav extends React.Component {

	constructor(props) {
		super(props);
		this.state = { view:TestStore.activeView }
	}

	updateView(view) {
		this.setState({ view:view })
		TestStore.updateView(view)

		console.log('Click')
	}

	render() {
		return <section>
			<ul>
				<li onClick={this.updateView.bind(this, 'graph')}> Graph </li>
				<li onClick={this.updateView.bind(this, 'api')}> API </li>
			</ul>
		</section>
	}

}

class TestView extends React.Component {
	constructor(props) {
		super(props); 
		this.state = { view:TestStore.activeView }

		TestStore.on('update', () => {
			this.setState({ view:TestStore.activeView });
			console.log('Updated View', this.state.view, TestStore.activeView)
		})
	}

	render() {

		console.log('view:', this.state.view)

		let View = {
			'api': <APIView></APIView>,
			'graph': <GraphView></GraphView>
		}[this.state.view]

		return (
			<section className='test-view'>
				<header>
					API Tools
					<Nav></Nav> 
				</header>
				{View} 
			</section>
		)
	}
}

ReactDOM.render(<TestView/>, document.getElementById('app-mainview'));
