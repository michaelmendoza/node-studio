import { apiTest } from '../../tests/api';

const LoadGraph = () => {
    const handleClick = async () => {

        var start = new Date().getTime();

        const sessionData = await apiTest();        

        var end = new Date().getTime();
        var time = end - start;

        console.log(sessionData);
        console.log('Computed in ' + (time / 1000.0));
    }

    return (        
        <div className="load-graph" >
            <div>
                <button onClick={handleClick}> Load </button>
            </div>
        </div>
    )
}

export default LoadGraph;