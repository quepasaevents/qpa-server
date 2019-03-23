// tslint:disable
// graphql typescript definitions

export namespace GQL {
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
  }

  interface IEventsOnQueryArguments {
    filter: IEventsQueryFilter;
  }

  interface IUser {
    __typename: 'User';
    name: string;
    username: string;
    email: string;
    id: string;
  }

  interface IEventsQueryFilter {
    limit?: number | null;
    owner?: string | null;
  }

  interface ICalendarEvent {
    __typename: 'CalendarEvent';
    id: string;
    owner: IUser;
    info: IEventInformation;
    time: IEventTime;
    status: any;
    contact: Array<IEventContactPerson>;
    location: ILocation;
  }

  interface IEventInformation {
    __typename: 'EventInformation';
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
    input?: ICreateEventInput | null;
    foo?: string | null;
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
    owner: string;
    time?: IEventTimeInput | null;
    info?: Array<IEventInformationInput | null> | null;
    location?: IEventLocationInput | null;
    meta?: IEventMetaInput | null;
    status: string;
    contact: Array<IEventContactPersonInput>;
  }

  interface IEventTimeInput {
    timeZone?: any | null;
    status?: any | null;
    start?: any | null;
    end?: any | null;
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
