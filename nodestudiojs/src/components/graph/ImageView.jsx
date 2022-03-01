import './ImageView.scss';
import { useState } from 'react';

const ImageView = () => {
    const [imageData, setImageData] = useState(null);

    const fetchData = () => {
        
    }

    return (
        <div className="image-view">
            <img src={imageData} alt='viewport'/>
        </div>
    )
}

export default ImageView;