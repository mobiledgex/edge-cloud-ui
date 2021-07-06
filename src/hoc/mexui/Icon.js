import { Icon as MIcon } from '@material-ui/core'
import React from 'react'

const Icon =(props)=>{
const {outlined} = props
return (
    <MIcon className={`material-icons${outlined ? '-outlined' : ''}`} {...props}>{props.children}</MIcon>
)}

export default Icon