import HistogramChart from "../Charts/Histogram";
import { useEffect, useContext, useState } from 'react';
import APIDataService from "../../services/APIDataService";
import AppState from "../../state/AppState";

const HistogramView = ({nodeID}) => {
    const {state} = useContext(AppState.AppContext);
    const [data, setData] = useState({ histogram: [{x0:0, x1:1, y:0}, {x0:1, x1:2, y:5}, {x0: 2, x1:3, y:1}, {x0: 3, x1:4, y:2}], min:0, max:5, mean:2, std:1 });

    useEffect(() => {
        console.log(data);
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.sessions]);

    const fetchData = async () => {
        const metadata = await APIDataService.getNodeMetadata(nodeID);
        console.log(metadata);
        if(metadata) setData(metadata);
    }

    return (
        <div>
            <HistogramChart width={200} height={200} data={data.histogram}></HistogramChart>
            <div>
                <div className="layout-row layout-space-between">
                    <div style={{width:'50%'}}>
                        <label> min </label>
                        {data.min.toFixed(2)}
                    </div>
                    <div style={{width:'50%'}}>
                        <label> max </label>
                        {data.max.toFixed(2)}
                    </div>
                </div>
                <div className="layout-row layout-space-between">
                    <div style={{width:'50%'}}>
                        <label> mean </label>
                        {data.mean.toFixed(2)}
                    </div>
                    <div style={{width:'50%'}}>
                        <label> std </label>
                        {data.std.toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HistogramView;