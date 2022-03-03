
import { useState } from 'react';
import './Select.scss';

const Select = ({options, onChange, placeholder='Select ...'}) => {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState(undefined);
    const onBlur = () => { setTimeout(() => { setShow(false) }, 250)}

    const handleClick = () => {
        setShow(!show)
    }

    const handleOptionSelect = (option) => {
        setValue(option);
        onChange(option);
        setShow(false);
    }

    return (
        <div className='select'>
            <button className='select-button' onClick={handleClick} onBlur={onBlur}> { value ? value.value : placeholder } </button>
            {
                show ? <div className='layout-column select-options'>
                    { options.map((option)=><button className='select-option' key={option.label} onClick={(e)=>handleOptionSelect(option)}>{option.label}</button>)}
                </div> : null
            }
        </div>
    )
}

export default Select