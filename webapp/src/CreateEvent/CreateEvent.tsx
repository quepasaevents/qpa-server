import * as React from 'react';
import styled from 'styled-components';

export default class CreateEvent extends React.Component {
 render() {
    return <Root>
      <Title>Post your own event</Title>
    </Root>
  }
}


const Root = styled.div`
  display: flex;
  flex-direction: column;
`
const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
`
