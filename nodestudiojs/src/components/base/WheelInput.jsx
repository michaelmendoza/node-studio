import { useEffect, useRef } from 'react';

const WheelInput = ({children, onWheel}) => {

    const _ref = useRef(null);

    useEffect(() => {
        const div = _ref.current;
        div.addEventListener('wheel', handleWheel, { passive: false });
        return () => { div.removeEventListener('wheel', handleWheel, { passive: false }); }
    })

    const handleWheel = (e) => {
        e.preventDefault();
        onWheel(e);
    }

    return (
        <div className='wheel-input' ref={_ref} style = {{ width : '100%', height : '100%' }}>
            { children }
        </div>
    )
}

export default WheelInput;