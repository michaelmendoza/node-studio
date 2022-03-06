import './TextInput.scss';

const TextInput = ({name, placeholder, value, onChange}) => {
    return (<div className='text-input'>
        <label>{name}</label>
        <input type='text' name={name} placeholder={placeholder} value={value} onChange={onChange}></input>
    </div>)
}

export default TextInput;