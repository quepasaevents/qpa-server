export type EventStatus = 'confirmed' | 'canceled'
// tslint:disable
// graphql typescript definitions
declare namespace GQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IQuery {
    __typename: 'Query';
    me: IUser | null;
    event: ICalendarEvent | null;
    events: Array<ICalendarEvent | null> | null;
    occurrences: Array<IEventOccurrence | null> | null;
    occurrence: IEventOccurrence | null;
  }

  interface IEventOnQueryArguments {
    id: string;
  }

  interface IEventsOnQueryArguments {
    filter: IEventsQueryFilter;
  }

  interface IOccurrencesOnQueryArguments {
    filter: IOccurrencesQueryFilter;
  }

  interface IOccurrenceOnQueryArguments {
    id: string;
  }

  interface IUser {
    __typename: 'User';
    name: string;
    username: string;
    email: string;
    id: string;
    events: Array<ICalendarEvent | null>;
  }

  interface ICalendarEvent {
    __typename: 'CalendarEvent';
    id: string;
    owner: IUser;
    info: Array<IEventInformation | null>;
    time: IEventTime;
    status: any;
    location: ILocation;
    occurrences: Array<IEventOccurrence | null> | null;
    meta: IEventMeta | null;
  }

  interface IEventInformation {
    __typename: 'EventInformation';
    language: string;
    title: string;
    description: string | null;
  }

  interface IEventTime {
    __typename: 'EventTime';
    timeZone: any | null;
    start: any | null;
    end: any | null;
    recurrence: string | null;
    exceptions: string | null;
  }

  interface ILocation {
    __typename: 'Location';
    address: string | null;
    name: string | null;
  }

  interface IEventOccurrence {
    __typename: 'EventOccurrence';
    id: string;
    event: ICalendarEvent;
    start: string;
    end: string;
  }

  interface IEventMeta {
    __typename: 'EventMeta';
    tags: Array<string | null>;
  }

  interface IEventsQueryFilter {
    owner?: string | null;
    limit?: number | null;
    from?: any | null;
    to?: any | null;
    categories?: Array<any | null> | null;
  }

  interface IOccurrencesQueryFilter {
    from?: any | null;
    to?: any | null;
    timeZone?: any | null;
    categories?: Array<any | null> | null;
    limit?: number | null;
  }

  interface IMutation {
    __typename: 'Mutation';
    signup: Array<IError | null> | null;
    signin: IUserSession;
    requestInvite: boolean;
    createEvent: ICalendarEvent | null;
    updateEvent: ICalendarEvent | null;
  }

  interface ISignupOnMutationArguments {
    input?: ISignupInput | null;
  }

  interface ISigninOnMutationArguments {
    input?: ISigninInput | null;
  }

  interface IRequestInviteOnMutationArguments {
    input?: IRequestInviteInput | null;
  }

  interface ICreateEventOnMutationArguments {
    input: ICreateEventInput;
  }

  interface IUpdateEventOnMutationArguments {
    input: IUpdateEventInput;
  }

  interface ISignupInput {
    email: string;
    username: string;
    name: string;
  }

  interface IError {
    __typename: 'Error';
    path: string;
    message: string;
  }

  interface ISigninInput {
    hash: string;
  }

  interface IUserSession {
    __typename: 'UserSession';
    hash: string;
    user: IUser;
    ctime: any;
    isValid: boolean;
  }

  interface IRequestInviteInput {
    email: string;
  }

  interface ICreateEventInput {
    time: IEventTimeInput;
    info: Array<IEventInformationInput | null>;
    location: IEventLocationInput;
    meta: IEventMetaInput;
    status: string;
  }

  interface IEventTimeInput {
    timeZone: any;
    start: any;
    end: any;
    recurrence?: string | null;
  }

  interface IEventInformationInput {
    language: string;
    title: string;
    description?: string | null;
  }

  interface IEventLocationInput {
    address?: string | null;
    name?: string | null;
  }

  interface IEventMetaInput {
    tags: Array<string | null>;
  }

  interface IUpdateEventInput {
    id: string;
    time?: IEventTimeInput | null;
    info?: Array<IEventInformationInput> | null;
    location?: IEventLocationInput | null;
    meta?: IEventMetaInput | null;
    status?: string | null;
  }
}
// tslint:enable
