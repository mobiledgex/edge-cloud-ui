import React from 'react'
import './style.css'

const LogoSpinner = () => {
    return (
        <div style={{ alignItems: 'center', height: '100vh', display: 'flex' }}>
            <img id="slidecaption" src='/assets/brand/logo_small_x.png' alt='Mobiledgex' style={{
                marginLeft: 'auto', marginRight: 'auto', display: 'block', width: '5%', alignItems: 'center'
            }} />
        </div>
    )
}

export default LogoSpinner