import React from 'react'
import { Input, InputAdornment } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/SearchRounded';
import ClearAllOutlinedIcon from '@material-ui/icons/ClearAllOutlined';
class SearchFilter extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            filterText: ''
        }
    }

    onValueChange = (e) => {
        let value = e.target.value
        this.setState({ filterText: value })
        this.props.onFilter(value)
    }

    onClear = () => {
        this.setState({ filterText: '' })
    }

    render() {
        return (
            <Input
                size="small"
                fullWidth
                style={this.props.style}
                value={this.state.filterText}
                startAdornment={
                    <InputAdornment style={{ fontSize: 17 }} position="start">
                        <SearchIcon />
                    </InputAdornment>
                }
                endAdornment={
                    <InputAdornment position="end">
                        <ClearAllOutlinedIcon style={{ fontSize: 17 }} onClick={this.onClear} />
                    </InputAdornment>
                }
                onChange={this.onValueChange}
                placeholder={'Search'} />
        )
    }
}

export default SearchFilter