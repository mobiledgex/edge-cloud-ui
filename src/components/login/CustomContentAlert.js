import React from 'react';
import { Icon, Label } from 'semantic-ui-react'
import Alert from 'react-s-alert';

const CustomContentAlert = (
    {
        id,
        email,
        classNames,
        styles,
        message,
        customFields,
        handleClose,
    }
    ) => {
    const handleConfirm = () => {
        alert('Customer confirmation!');
        Alert.close(id);
    }
    const getEmail=()=>(email)
    return (
        <div className={classNames} id={id} style={styles}>
            <div className='s-alert-box-inner'>
                <div>{message}</div>
                <br/>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <Icon.Group size='huge'>
                        <Icon loading size='big' name='circle notch' />
                        <Icon name='mail' />
                    </Icon.Group>
                </div>
            </div>
            <h3 className="customer">{email}</h3>
            <span className='s-alert-close' onClick={handleClose}></span>
        </div>
    );
}

export default CustomContentAlert;
