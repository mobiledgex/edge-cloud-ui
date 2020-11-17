import { Button } from '@material-ui/core'
import React from 'react'
import { Grid, Image } from 'semantic-ui-react'

class MexOTP extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            textcode: undefined,
            totp: ''
        }
        let responseData = this.props.data.responseData
        this.TOTPQRImage = responseData.TOTPQRImage
        this.TOTPSharedKey = responseData.TOTPSharedKey
    }

    loadTextCode = () => {
        this.setState({ textcode: this.TOTPSharedKey })
    }

    onDone = () => {
        this.props.onComplete()
    }

    render() {
        const { textcode } = this.state
        return (
            <Grid>
                <Grid.Row>
                    <span className='title'>Scan this barcode with your app</span>
                </Grid.Row>
                <Grid.Row>
                    <span style={{ textAlign: 'left', color: '#FFFFFF' }}>
                        {textcode ? <div>Enter this code into the app</div> :
                            <div>Scan the image below with the two-factor authentication app on your phone. If you can't use a barcode, <button className='otp-registration-link' onClick={this.loadTextCode}>enter this text code instead.</button></div>}
                    </span>
                </Grid.Row>
                <Grid.Row>
                    <div style={{ width: '100%' }} align="center">
                        {textcode ? <code style={{ backgroundColor: '#9b9b9b', color: '#FFF', padding: 5 }}>{textcode}</code> :
                            <Image src={`data:image/png;base64,${this.TOTPQRImage}`} />}
                    </div>
                </Grid.Row>
                <Grid.Row>
                    <Button size='small' variant="outlined" onClick={this.onDone} style={{ marginLeft: 10, color: '#93E019', borderColor: '#93E019' }}>Done</Button>
                </Grid.Row>
            </Grid>
        )
    }
}

export default MexOTP