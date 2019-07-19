import * as React from 'react'
import {RouteComponentProps, withRouter} from "react-router"
import OccurrenceDetailsQuery from "./OccurrenceDetailsQuery";

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
        return (
          <div>
            { data.occurrence.event.info[0].title}
          </div>
        )

      }    }
  </OccurrenceDetailsQuery>
}

export default withRouter(OccurrenceDetails)
