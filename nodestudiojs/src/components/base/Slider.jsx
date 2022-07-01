import './Slider.scss';

const Slider = ({ value, onChange, onMouseUp, label='', min = 0, max = 100, step = 1, className=''}) => {

    const handleChange = (e) => {
        const value = parseInt(e.target.value);
        onChange(value);
    }

    const handleMouseUp = (e) => {
        const value = parseInt(e.target.value);
        onMouseUp(value);
    }
    
    return (
        <div className={ 'slider layout-row-center layout-space-between ' + className }>
            { label !== '' ? <label> {label} </label> : null }
            <span className='slider-input flex'>
                <input type="range" name="zoom" 
                    value={value} 
                    min={min} 
                    max={max}
                    step={step}
                    onMouseUp={handleMouseUp}
                    onChange={handleChange}/>
            </span>
            <label> {value} </label>
        </div>
    )
}

export default Slider;
