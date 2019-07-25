import * as React from 'react'
import {RouteComponentProps, withRouter} from "react-router"
import OccurrenceDetailsQuery from "./OccurrenceDetailsQuery"
import styled from '@emotion/styled'

interface RouteParams {
  occurrenceId: string
  sanitizedEventName: string
}

interface Props extends RouteComponentProps<RouteParams> {
}

const OccurrenceDetails = (props: Props) => {
  return <OccurrenceDetailsQuery variables={{occurrenceId: props.match.params.occurrenceId}}>
    {
      ({data, loading, error}) => {
        if (loading) {
          return <p>loading...</p>
        }
        if (error) {
          return <p>{error.message}</p>
        }
        const info = data.occurrence.event.info[0]
        return (
          <Root>
            <Title>
              { info.title }
            </Title>
            <Info>
              { info.description }
            </Info>
          </Root>
        )

      }    }
  </OccurrenceDetailsQuery>
}

const Title = styled.div`
  grid-row: title;
`

const Info = styled.div`
  grid-row: info
`

const Root = styled.div`
  display: grid;
  grid-template-rows: 48px [title] 1fr [info];
`

export default withRouter(OccurrenceDetails)
