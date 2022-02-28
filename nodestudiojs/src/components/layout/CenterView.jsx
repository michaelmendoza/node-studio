import './CenterView.scss';

const CenterView = ({children}) => {
    return (
        <div className='center-view'>
            {children}
        </div>
    )
}

export default CenterView;