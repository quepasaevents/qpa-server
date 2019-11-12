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
    user: IUser | null;
    event: ICalendarEvent | null;
    events: Array<ICalendarEvent | null> | null;
    occurrences: Array<IEventOccurrence | null> | null;
    occurrence: IEventOccurrence | null;
    tags: Array<IEventTag | null> | null;
  }

  interface IUserOnQueryArguments {
    id: string;
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
    username: string | null;
    email: string;
    id: string;
    events: Array<ICalendarEvent | null>;
    roles: Array<IUserRole> | null;
  }

  interface ICalendarEvent {
    __typename: 'CalendarEvent';
    id: string;
    owner: IUser;
    infos: Array<IEventInformation | null>;
    info: IEventInformation | null;
    time: IEventTime;
    status: any;
    location: ILocation;
    occurrences: Array<IEventOccurrence | null> | null;
    tags: Array<IEventTag | null> | null;
  }

  interface IInfoOnCalendarEventArguments {
    lang: string;
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

  interface IEventTag {
    __typename: 'EventTag';
    id: string;
    name: string;
    translations: Array<IEventTagTranslation>;
    translation: IEventTagTranslation | null;
  }

  interface ITranslationOnEventTagArguments {
    language: string;
  }

  interface IEventTagTranslation {
    __typename: 'EventTagTranslation';
    id: string;
    language: string;
    text: string;
  }

  interface IUserRole {
    __typename: 'UserRole';
    user: IUser;
    type: any;
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
    grantRole: IUser;
    revokeRole: IUser;
    createEvent: ICalendarEvent | null;
    updateEvent: ICalendarEvent | null;
    deleteEvent: IUser;
    createEventTag: IEventTag | null;
    updateEventTag: IEventTag | null;
    deleteEventTag: Array<IEventTag | null> | null;
  }

  interface ISignupOnMutationArguments {
    input: ISignupInput;
  }

  interface ISigninOnMutationArguments {
    input: ISigninInput;
  }

  interface IRequestInviteOnMutationArguments {
    input: IRequestInviteInput;
  }

  interface IGrantRoleOnMutationArguments {
    input: IGrantRoleInput;
  }

  interface IRevokeRoleOnMutationArguments {
    input: IGrantRoleInput;
  }

  interface ICreateEventOnMutationArguments {
    input: ICreateEventInput;
  }

  interface IUpdateEventOnMutationArguments {
    input: IUpdateEventInput;
  }

  interface IDeleteEventOnMutationArguments {
    id: string;
  }

  interface ICreateEventTagOnMutationArguments {
    input: ICreateEventTagInput;
  }

  interface IUpdateEventTagOnMutationArguments {
    input: IUpdateEventTagInput;
  }

  interface IDeleteEventTagOnMutationArguments {
    input: IDeleteEventTagInput;
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

  interface IGrantRoleInput {
    userId: string;
    roleType: any;
  }

  interface ICreateEventInput {
    time: IEventTimeInput;
    infos: Array<IEventInformationInput | null>;
    location: IEventLocationInput;
    tagNames: Array<string>;
    status: string;
  }

  interface IEventTimeInput {
    timeZone: any;
    start: any;
    end: any;
    recurrence?: string | null;
    exceptions?: string | null;
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

  interface IUpdateEventInput {
    id: string;
    time?: IEventTimeInput | null;
    infos?: Array<IEventInformationInput> | null;
    location?: IEventLocationInput | null;
    tagNames: Array<string>;
    status?: string | null;
  }

  interface ICreateEventTagInput {
    name: string;
    translations: Array<ICreateModifyEventTagTranslationInput>;
  }

  interface ICreateModifyEventTagTranslationInput {
    language: string;
    text: string;
  }

  interface IUpdateEventTagInput {
    id: string;
    name: string;
    translations: Array<ICreateModifyEventTagTranslationInput>;
  }

  interface IDeleteEventTagInput {
    id: string;
  }

  interface IRevokeRoleInput {
    userId: string;
    roleType: any;
  }
}

// tslint:enable
