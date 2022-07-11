import './SideView.scss';

export const SideViewPositions = {
    'LEFT': 'left',
    'RIGHT': 'right'
}

const SideView = ({children, position = SideViewPositions.LEFT}) => { 
    // Position should be 'left' or 'right'

    return (
        <div className={position+'-side-view'}>
            { children }
        </div>
    );
}

export default SideView;