import { Icon as MIcon } from '@material-ui/core'
import React from 'react'

const Icon =(props)=>{
return (
    <MIcon className='material-icons-outlined' {...props}>{props.children}</MIcon>
)}

export default Icon