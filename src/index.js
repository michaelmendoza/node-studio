//import CSS from "./test/main.scss";
//import AppView from './test/app-view.jsx';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './mr-graph/app.jsx';
import 'normalize.css';
import Styles from './mr-graph/styles/styles.scss';

const root = document.getElementById('app-hook')
ReactDOM.render(<App/>, root);