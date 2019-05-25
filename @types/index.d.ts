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
    events: Array<ICalendarEvent | null> | null;
    occurrences: Array<IEventOccurrence | null> | null;
  }

  interface IEventsOnQueryArguments {
    filter: IEventsQueryFilter;
  }

  interface IOccurrencesOnQueryArguments {
    filter: IOccurrencesQueryFilter;
  }

  interface IUser {
    __typename: 'User';
    name: string;
    username: string;
    email: string;
    id: string;
  }

  interface IEventsQueryFilter {
    owner?: string | null;
    limit?: number | null;
    from?: any | null;
    to?: any | null;
    categories?: Array<any | null> | null;
  }

  interface ICalendarEvent {
    __typename: 'CalendarEvent';
    id: string;
    owner: IUser;
    info: Array<IEventInformation | null>;
    time: IEventTime;
    status: any;
    contact: Array<IEventContactPerson>;
    location: ILocation;
    occurrences: Array<IEventOccurrence | null> | null;
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

  interface IEventContactPerson {
    __typename: 'EventContactPerson';
    name: string;
    languages: Array<any> | null;
    contact: IContact | null;
  }

  interface IContact {
    __typename: 'Contact';
    email: string | null;
    phone: string | null;
  }

  interface ILocation {
    __typename: 'Location';
    address: string | null;
    name: string | null;
    coordinate: IGeoCoordinate | null;
  }

  interface IGeoCoordinate {
    __typename: 'GeoCoordinate';
    lat: number | null;
    lng: number | null;
  }

  interface IEventOccurrence {
    __typename: 'EventOccurrence';
    id: string;
    event: ICalendarEvent;
    start: string;
    utcStart: string;
    end: string;
    utcEnd: string;
    timeZone: string;
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
    time?: IEventTimeInput | null;
    info?: Array<IEventInformationInput | null> | null;
    location?: IEventLocationInput | null;
    meta?: IEventMetaInput | null;
    status: string;
    contact: Array<IEventContactPersonInput>;
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
    coordinate?: IGeoCoordinateInput | null;
  }

  interface IGeoCoordinateInput {
    lat?: number | null;
    lng?: number | null;
  }

  interface IEventMetaInput {
    tags?: Array<string | null> | null;
  }

  interface IEventContactPersonInput {
    name: string;
    languages?: Array<any> | null;
    contact?: IEventContactInput | null;
  }

  interface IEventContactInput {
    email?: string | null;
    phone?: string | null;
  }
}

// tslint:enable
