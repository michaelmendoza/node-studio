import './Slider.scss';

const Slider = ({ value, onChange, label='', min = 0, max = 100, step = 1, className='' }) => {

    const handleChange = (e) => {
        const value = parseInt(e.target.value);
        onChange(value);
    }

    return (
        <div className={ 'slider layout-row-center ' + className }>
            { label !== '' ? <label> {label} </label> : null }
            <span className='slider-input flex'>
                <input type="range" name="zoom" 
                    value={value} 
                    min={min} 
                    max={max}
                    step={step}
                    onChange={handleChange}/>
            </span>
            <label> {value} </label>
        </div>
    )
}

export default Slider;
