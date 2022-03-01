import './Tabs.scss';
import { useState } from 'react';

const Tabs = ({children, tabnames, style, className}) => {

    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className={'tabs ' + className} style={style}>
            <div className='tabs-header layout-row-center'> 
                {
                    tabnames.map((tabname, index) => <button key={tabname} className={ index === activeTab ? "active" : ""} onClick={() => setActiveTab(index)}>{tabname}</button>)
                }
            </div>
            <div className='tabs-content'> 
                { 
                    children.map((child, index) => index === activeTab ? child : null)
                }
            </div>

        </div>
    )
}

export default Tabs;