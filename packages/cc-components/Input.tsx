import MUIInput, {InputProps as MUIInputProps} from '@material-ui/core/Input'
import styled from 'cc-styled'
import * as React from 'react'

interface Props extends MUIInputProps {

}

const InputBase = (props: Props) => <MUIInput {...props} />

const Input = styled(InputBase)`

`

export default Input
