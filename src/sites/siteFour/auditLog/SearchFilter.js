import React from 'react'
import { Input, InputAdornment } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/CloseRounded';
import SearchIcon from '@material-ui/icons/SearchRounded';

const SearchFilter = () => {

    const [filterText, setFilterText] = React.useState('')

    const onValueChange = () => {

    }

    const onClear = () => {
        setFilterText('')
    }

    return (
        <Input
            size="small"
            fullWidth
            style={{ padding: '0 14px 0 14px' }}
            value={filterText}
            startAdornment={
                <InputAdornment style={{ fontSize: 17 }} position="start">
                    <SearchIcon />
                </InputAdornment>
            }
            endAdornment={
                <InputAdornment position="end">
                    <CloseIcon style={{ fontSize: 17 }} onClick={onClear} />
                </InputAdornment>
            }
            onChange={onValueChange}
            placeholder={'Search'} />
    )
}

export default SearchFilter