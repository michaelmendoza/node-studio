import HistogramChart from "../../Charts/Histogram";
import { useEffect, useState } from 'react';
import APIDataService from "../../../services/APIDataService";

const HistogramView = ({node, nodeID}) => {
    const [data, setData] = useState({ histogram: [{x0:0, x1:1, y:0}, {x0:1, x1:2, y:5}, {x0: 2, x1:3, y:1}, {x0: 3, x1:4, y:2}], min:0, max:5, mean:2, std:1 });

    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [node.view.update]);

    const fetchData = async () => {
        //if (!node.view.hasData) return;
        const metadata = await APIDataService.getNodeMetadata(nodeID);
        if(metadata?.histogram) setData(metadata);
    }

    const formatNumber = (x) => {
        if (x === 0)
            return 0;
        if (x > 10000 || x < 0.0001)
            return x.toExponential(2)
        if (x % 1 === 0)
            return x;
        else
            return x.toFixed(2)    
    }

    return (
        <div>
            <HistogramChart width={310} height={310} data={data.histogram}></HistogramChart>
            <div>
                <div className="layout-row layout-space-between">
                    <div style={{width:'50%'}}>
                        <label> min </label>
                        { formatNumber(data.min) }
                    </div>
                    <div style={{width:'50%'}}>
                        <label> max </label>
                        { formatNumber(data.max) }
                    </div>
                </div>
                <div className="layout-row layout-space-between">
                    <div style={{width:'50%'}}>
                        <label> mean </label>
                        { formatNumber(data.mean) }
                    </div>
                    <div style={{width:'50%'}}>
                        <label> std </label>
                        { formatNumber(data.std) }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HistogramView;