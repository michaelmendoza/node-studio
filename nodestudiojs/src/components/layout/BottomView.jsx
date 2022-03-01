import './BottomView.scss';

const BottomView = ({children}) => {
    return (
        <div className='bottom-view'>
            <div className='bottom-view-container'>
                { children }
            </div>
        </div>
    )
}

export default BottomView;