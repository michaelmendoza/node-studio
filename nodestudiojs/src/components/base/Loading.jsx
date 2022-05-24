import './Loading.scss';

/**
 * Component that display a spinner icon.
 * Adapted from https://loading.io/css/
 */ 
export const LoadingSpinner = () => (
    <div className="loading-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
);

const Loading = () => (
        <div className='layout-center' style={{ width: '100%', height: '500px' }}>
            <div>
                <LoadingSpinner></LoadingSpinner>
                <div>Loading</div>
            </div>
        </div>    
    );

export default Loading;


