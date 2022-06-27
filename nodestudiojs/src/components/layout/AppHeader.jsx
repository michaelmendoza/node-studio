import './AppHeader.scss';
import Logo from '../../images/mri_icon.jpeg';
import { useState } from 'react';

const AppHeader = () => {
    return (
        <header className="app-header">
            <span className='logo'> 
                <img src={Logo} alt='logo'/>
                <label> Node Studio  </label>
            </span>

            <span className='flex'>
            </span>

            { false ? <HeaderLogin></HeaderLogin> : null }
        </header>
    );
}

const HeaderLogin = () => {
    const [show, setShow] = useState(false);
    const onBlur = () => { setTimeout(() => { setShow(false) }, 100)  }

    const handleLoginClick = () => {
        setShow(!show);
    }

    const handleLogoutClick = () => {
        setShow(!show)
    }

    return (
        <div className='header-login'>
            <button className='icon-button' onClick={handleLoginClick} onBlur={onBlur}> 
                <i className="material-icons">account_circle</i> 
                { 
                show ? <div className='login-dropdown' >
                    <button onClick={()=>{}}> Profile </button>
                    <button onClick={handleLogoutClick}> Logout </button>
                </div> : null
            }
            </button>
        </div>
    )
}

export default AppHeader;