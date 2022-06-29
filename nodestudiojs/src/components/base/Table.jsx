import { isNumberOrString } from "../../libraries/utils";
import './Table.scss';

const Table = (props) => {
    return (
        <div className='table'>
                <TableHeader headers = {props.headers}></TableHeader>
                { props.data.map((row, index) => <TableRow key={index} row={row}></TableRow>) }
        </div>
    );
};

const TableHeader = (props) => {
    return (
        <div className='table-header layout-row-center'>
            {
                props.headers.map((header, index) => <div key={index} className='table-header-cell flex'>{header}</div>)
            }
        </div>
    );
}

const TableRow = (props) => {
    return (
        <div className='table-row layout-row-center'>
            {
                props.row.map((cell, index) => {  
                    cell = isNumberOrString(cell) ? cell : JSON.stringify(cell);
                    return <div key={index} className='table-row-cell flex'>{cell}</div> 
                })
            }
        </div>
    )
};

export default Table;