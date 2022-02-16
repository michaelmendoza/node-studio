import 'normalize.css';
import './styles/app.scss';
import './App.css';
import Viewport from './components/layout/Viewport';
import LoadGraph from './components/shared/LoadGraph';

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <LoadGraph></LoadGraph>
        <Viewport></Viewport>
      </header>
    </div>
  );
}

export default App;
