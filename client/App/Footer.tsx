import * as React from 'react'
import styled from '@emotion/styled'

interface Props {
  className?: string
}
const Footer = (props: Props) => (
  <Root className={props.className}>

  </Root>
)

const Root = styled.div`
  background: rgba(0, 0, 0, 0.1);
`

export default Footer
