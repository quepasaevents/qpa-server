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
    revisions: Array<IEventRevision | null> | null;
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

  interface IRevisionsOnQueryArguments {
    filter: IRevisionsQueryFilter;
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
    images: IEventImages | null;
    publishedState: any;
    revisionState: any;
    revisions: Array<IEventRevision | null> | null;
  }

  interface IInfoOnCalendarEventArguments {
    lang: string;
  }

  interface IEventInformation {
    __typename: 'EventInformation';
    id: string;
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

  interface IEventImages {
    __typename: 'EventImages';
    event: ICalendarEvent | null;
    thumb: IEventImage | null;
    cover: IEventImage | null;
    poster: IEventImage | null;
    gallery: Array<IEventImage> | null;
  }

  interface IEventImage {
    __typename: 'EventImage';
    url: string;
  }

  interface IEventRevision {
    __typename: 'EventRevision';
    id: string;
    event: ICalendarEvent;
    author: IUser;
    conclusion: string | null;
    comment: string | null;
    createdAt: any;
    submittedAt: any | null;
    dismissedBy: IUser | null;
    lastChangedAt: any;
  }

  interface IUserRole {
    __typename: 'UserRole';
    user: IUser;
    type: any;
  }

  interface IEventsQueryFilter {
    owner?: string | null;
    limit?: number | null;
    pendingRevision?: boolean | null;
  }

  interface IOccurrencesQueryFilter {
    from?: any | null;
    to?: any | null;
    timeZone?: any | null;
    categories?: Array<any | null> | null;
    limit?: number | null;
  }

  interface IRevisionsQueryFilter {
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
    startEventRevision: ICalendarEvent | null;
    submitEventRevision: ICalendarEvent | null;
    requestEventRevision: ICalendarEvent | null;
    dismissOpenEventRevision: ICalendarEvent | null;
    setEventImage: ICalendarEvent | null;
    unsetEventImage: ICalendarEvent | null;
    addEventGalleryImages: ICalendarEvent | null;
    removeEventGalleryImages: ICalendarEvent | null;
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

  interface IStartEventRevisionOnMutationArguments {
    input: IStartEventRevisionInput;
  }

  interface ISubmitEventRevisionOnMutationArguments {
    input: IReviseEventInput;
  }

  interface IRequestEventRevisionOnMutationArguments {
    input: IRequestRevisionInput;
  }

  interface IDismissOpenEventRevisionOnMutationArguments {
    input: IEventRevisionInput;
  }

  interface ISetEventImageOnMutationArguments {
    input: IEventImageUploadInput;
  }

  interface IUnsetEventImageOnMutationArguments {
    id: IUnsetEventImageInput;
  }

  interface IAddEventGalleryImagesOnMutationArguments {
    input: IEventImagesUploadInput;
  }

  interface IRemoveEventGalleryImagesOnMutationArguments {
    input: IEventGalleryImagesInput;
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
    publishedState: any;
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
    publishedState: any;
  }

  interface IStartEventRevisionInput {
    eventId: string;
  }

  interface IReviseEventInput {
    revisionId: string;
    conclusion: string;
    comment?: string | null;
  }

  interface IRequestRevisionInput {
    eventId: string;
  }

  interface IEventRevisionInput {
    revisionId: string;
  }

  interface IEventImageUploadInput {
    eventId: string;
    imageType?: any | null;
    file: any;
  }

  interface IUnsetEventImageInput {
    eventId: string;
    imageType?: any | null;
  }

  interface IEventImagesUploadInput {
    files: Array<any>;
    id: string;
  }

  interface IEventGalleryImagesInput {
    eventId: string;
    imageIds: Array<string>;
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
