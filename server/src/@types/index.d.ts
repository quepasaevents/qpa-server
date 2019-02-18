// tslint:disable
export type Maybe<T> = T | null;

export interface EventsQueryFilter {
  count?: Maybe<number>;
}

export interface SignupInput {
  email: string;

  username: string;

  firstName: string;

  lastName?: Maybe<string>;
}

export interface SigninInput {
  hash: string;
}

export interface RequestInviteInput {
  email: string;
}

export interface CreateEventInput {
  time?: Maybe<EventTimeInput>;

  info?: Maybe<(Maybe<EventInformationInput>)[]>;

  location?: Maybe<EventLocationInput>;

  meta?: Maybe<EventMetaInput>;
  owner: string
}

export interface EventTimeInput {
  timeZone?: Maybe<TimeZone>;

  status?: Maybe<EventStatus>;

  start?: Maybe<Timestamp>;

  end?: Maybe<Timestamp>;
}

export interface EventInformationInput {
  language: string;

  title: string;

  description?: Maybe<string>;
}

export interface EventLocationInput {
  address?: Maybe<string>;

  name?: Maybe<string>;

  coordinate?: Maybe<GeoCoordinateInput>;
}

export interface GeoCoordinateInput {
  lat?: Maybe<number>;

  lng?: Maybe<number>;
}

export interface EventMetaInput {
  tags?: Maybe<(Maybe<string>)[]>;
}

export interface EventContactInput {
  email?: Maybe<string>;

  phone?: Maybe<string>;
}

export interface AdditionalEntityFields {
  path?: Maybe<string>;

  type?: Maybe<string>;
}

/** IANA Timezone e.g. "Europe/Zurich" */
export type TimeZone = any;

/** in RFC3339 e.g. 2002-10-02T10:00:00-05:00 or 2002-10-02T15:00:00Z */
export type Timestamp = any;

/** "confirmed" | "tentative" | "cancelled" */
export type EventStatus = any;

/** e.g. 'de', 'en', etc' */
export type Language = any;

export type Date = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  /** Auth */
  me?: Maybe<User>;
  /** Event */
  events?: Maybe<(Maybe<CalendarEvent>)[]>;
}

export interface User {
  firstName: string;

  lastName?: Maybe<string>;

  username: string;

  email: string;

  id: string;
}

export interface CalendarEvent {
  id: string;

  owner: User;

  info: EventInformation[];

  time: EventTime;

  status: EventStatus;

  contact: EventContactPerson[];

  location: Location;
}

/** Event information for presentation */
export interface EventInformation {
  language: string;

  title: string;

  description?: Maybe<string>;
}

export interface EventTime {
  timeZone?: Maybe<TimeZone>;

  start?: Maybe<Timestamp>;

  end?: Maybe<Timestamp>;

  recurrence?: Maybe<string>;

  exceptions?: Maybe<string>;
}

export interface EventContactPerson {
  name: string;

  languages?: Maybe<Language[]>;

  contact?: Maybe<Contact>;
}

export interface Contact {
  email?: Maybe<string>;

  phone?: Maybe<string>;
}

export interface Location {
  address?: Maybe<string>;

  name?: Maybe<string>;

  coordinate?: Maybe<GeoCoordinate>;
}

export interface GeoCoordinate {
  lat?: Maybe<number>;

  lng?: Maybe<number>;
}

export interface Mutation {
  /** Auth */
  signup: boolean;

  signin: UserSession;

  requestInvite: boolean;
  /** Event */
  createEvent?: Maybe<CalendarEvent>;
}

export interface UserSession {
  hash: string;

  user: User;

  ctime: Date;

  isValid: boolean;
}

// ====================================================
// Arguments
// ====================================================

export interface EventsQueryArgs {
  filter?: Maybe<EventsQueryFilter>;
}
export interface SignupMutationArgs {
  input?: Maybe<SignupInput>;
}
export interface SigninMutationArgs {
  input?: Maybe<SigninInput>;
}
export interface RequestInviteMutationArgs {
  input?: Maybe<RequestInviteInput>;
}
export interface CreateEventMutationArgs {
  input?: Maybe<CreateEventInput>;
}

import { ObjectID } from "mongodb";

export interface UserDbObject {
  firstName: string;
  lastName: Maybe<string>;
  username: string;
  email: string;
  _id: ObjectID;
}

export interface CalendarEventDbObject {
  _id: ObjectID;
  owner: ObjectID;
  info: Maybe<(Maybe<EventInformationDbObject>)[]>;
  time: Maybe<EventTimeDbObject>;
  status: EventStatus;
  contact: Maybe<EventContactPersonDbObject[]>;
  location: Maybe<Location>;
}

export interface EventInformationDbObject {
  language: string;
  title: string;
  description: Maybe<string>;
}

export interface EventTimeDbObject {
  timeZone: Maybe<TimeZone>;
  start: Maybe<Timestamp>;
  end: Maybe<Timestamp>;
  recurrence: Maybe<string>;
  exceptions: Maybe<string>;
}

export interface EventContactPersonDbObject {
  name: string;
  languages: Maybe<Language[]>;
  contact: Maybe<ContactDbObject>;
}

export interface ContactDbObject {
  email: Maybe<string>;
  phone: Maybe<string>;
}

export interface GeoCoordinateDbObject {
  lat: Maybe<number>;
  lng: Maybe<number>;
}

export interface UserSessionDbObject {
  hash: string;
  user: ObjectID;
  ctime: Date;
  isValid: boolean;
}
import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig
} from "graphql";

export type Resolver<Result, Parent = {}, Context = {}, Args = {}> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: GraphQLResolveInfo
) => Promise<Result> | Result;

export interface ISubscriptionResolverObject<Result, Parent, Context, Args> {
  subscribe<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): AsyncIterator<R | Result> | Promise<AsyncIterator<R | Result>>;
  resolve?<R = Result, P = Parent>(
    parent: P,
    args: Args,
    context: Context,
    info: GraphQLResolveInfo
  ): R | Result | Promise<R | Result>;
}

export type SubscriptionResolver<
  Result,
  Parent = {},
  Context = {},
  Args = {}
> =
  | ((
      ...args: any[]
    ) => ISubscriptionResolverObject<Result, Parent, Context, Args>)
  | ISubscriptionResolverObject<Result, Parent, Context, Args>;

export type TypeResolveFn<Types, Parent = {}, Context = {}> = (
  parent: Parent,
  context: Context,
  info: GraphQLResolveInfo
) => Maybe<Types>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult, TArgs = {}, TContext = {}> = (
  next: NextResolverFn<TResult>,
  source: any,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export namespace QueryResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    /** Auth */
    me?: MeResolver<Maybe<User>, TypeParent, Context>;
    /** Event */
    events?: EventsResolver<
      Maybe<(Maybe<CalendarEvent>)[]>,
      TypeParent,
      Context
    >;
  }

  export type MeResolver<R = Maybe<User>, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type EventsResolver<
    R = Maybe<(Maybe<CalendarEvent>)[]>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, EventsArgs>;
  export interface EventsArgs {
    filter?: Maybe<EventsQueryFilter>;
  }
}

export namespace UserResolvers {
  export interface Resolvers<Context = {}, TypeParent = User> {
    firstName?: FirstNameResolver<string, TypeParent, Context>;

    lastName?: LastNameResolver<Maybe<string>, TypeParent, Context>;

    username?: UsernameResolver<string, TypeParent, Context>;

    email?: EmailResolver<string, TypeParent, Context>;

    id?: IdResolver<string, TypeParent, Context>;
  }

  export type FirstNameResolver<
    R = string,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LastNameResolver<
    R = Maybe<string>,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type UsernameResolver<
    R = string,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type EmailResolver<R = string, Parent = User, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type IdResolver<R = string, Parent = User, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace CalendarEventResolvers {
  export interface Resolvers<Context = {}, TypeParent = CalendarEvent> {
    id?: IdResolver<string, TypeParent, Context>;

    owner?: OwnerResolver<User, TypeParent, Context>;

    info?: InfoResolver<
      Maybe<(Maybe<EventInformation>)[]>,
      TypeParent,
      Context
    >;

    time?: TimeResolver<Maybe<EventTime>, TypeParent, Context>;

    status?: StatusResolver<EventStatus, TypeParent, Context>;

    contact?: ContactResolver<Maybe<EventContactPerson[]>, TypeParent, Context>;

    location?: LocationResolver<Maybe<Location>, TypeParent, Context>;
  }

  export type IdResolver<
    R = string,
    Parent = CalendarEvent,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type OwnerResolver<
    R = User,
    Parent = CalendarEvent,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type InfoResolver<
    R = Maybe<(Maybe<EventInformation>)[]>,
    Parent = CalendarEvent,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TimeResolver<
    R = Maybe<EventTime>,
    Parent = CalendarEvent,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = EventStatus,
    Parent = CalendarEvent,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ContactResolver<
    R = Maybe<EventContactPerson[]>,
    Parent = CalendarEvent,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LocationResolver<
    R = Maybe<Location>,
    Parent = CalendarEvent,
    Context = {}
  > = Resolver<R, Parent, Context>;
}
/** Event information for presentation */
export namespace EventInformationResolvers {
  export interface Resolvers<Context = {}, TypeParent = EventInformation> {
    language?: LanguageResolver<string, TypeParent, Context>;

    title?: TitleResolver<string, TypeParent, Context>;

    description?: DescriptionResolver<Maybe<string>, TypeParent, Context>;
  }

  export type LanguageResolver<
    R = string,
    Parent = EventInformation,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TitleResolver<
    R = string,
    Parent = EventInformation,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type DescriptionResolver<
    R = Maybe<string>,
    Parent = EventInformation,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace EventTimeResolvers {
  export interface Resolvers<Context = {}, TypeParent = EventTime> {
    timeZone?: TimeZoneResolver<Maybe<TimeZone>, TypeParent, Context>;

    start?: StartResolver<Maybe<Timestamp>, TypeParent, Context>;

    end?: EndResolver<Maybe<Timestamp>, TypeParent, Context>;

    recurrence?: RecurrenceResolver<Maybe<string>, TypeParent, Context>;

    exceptions?: ExceptionsResolver<Maybe<string>, TypeParent, Context>;
  }

  export type TimeZoneResolver<
    R = Maybe<TimeZone>,
    Parent = EventTime,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type StartResolver<
    R = Maybe<Timestamp>,
    Parent = EventTime,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type EndResolver<
    R = Maybe<Timestamp>,
    Parent = EventTime,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type RecurrenceResolver<
    R = Maybe<string>,
    Parent = EventTime,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ExceptionsResolver<
    R = Maybe<string>,
    Parent = EventTime,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace EventContactPersonResolvers {
  export interface Resolvers<Context = {}, TypeParent = EventContactPerson> {
    name?: NameResolver<string, TypeParent, Context>;

    languages?: LanguagesResolver<Maybe<Language[]>, TypeParent, Context>;

    contact?: ContactResolver<Maybe<Contact>, TypeParent, Context>;
  }

  export type NameResolver<
    R = string,
    Parent = EventContactPerson,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LanguagesResolver<
    R = Maybe<Language[]>,
    Parent = EventContactPerson,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ContactResolver<
    R = Maybe<Contact>,
    Parent = EventContactPerson,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace ContactResolvers {
  export interface Resolvers<Context = {}, TypeParent = Contact> {
    email?: EmailResolver<Maybe<string>, TypeParent, Context>;

    phone?: PhoneResolver<Maybe<string>, TypeParent, Context>;
  }

  export type EmailResolver<
    R = Maybe<string>,
    Parent = Contact,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type PhoneResolver<
    R = Maybe<string>,
    Parent = Contact,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace LocationResolvers {
  export interface Resolvers<Context = {}, TypeParent = Location> {
    address?: AddressResolver<Maybe<string>, TypeParent, Context>;

    name?: NameResolver<Maybe<string>, TypeParent, Context>;

    coordinate?: CoordinateResolver<Maybe<GeoCoordinate>, TypeParent, Context>;
  }

  export type AddressResolver<
    R = Maybe<string>,
    Parent = Location,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type NameResolver<
    R = Maybe<string>,
    Parent = Location,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type CoordinateResolver<
    R = Maybe<GeoCoordinate>,
    Parent = Location,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace GeoCoordinateResolvers {
  export interface Resolvers<Context = {}, TypeParent = GeoCoordinate> {
    lat?: LatResolver<Maybe<number>, TypeParent, Context>;

    lng?: LngResolver<Maybe<number>, TypeParent, Context>;
  }

  export type LatResolver<
    R = Maybe<number>,
    Parent = GeoCoordinate,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LngResolver<
    R = Maybe<number>,
    Parent = GeoCoordinate,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export namespace MutationResolvers {
  export interface Resolvers<Context = {}, TypeParent = {}> {
    /** Auth */
    signup?: SignupResolver<boolean, TypeParent, Context>;

    signin?: SigninResolver<UserSession, TypeParent, Context>;

    requestInvite?: RequestInviteResolver<boolean, TypeParent, Context>;
    /** Event */
    createEvent?: CreateEventResolver<
      Maybe<CalendarEvent>,
      TypeParent,
      Context
    >;
  }

  export type SignupResolver<R = boolean, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context,
    SignupArgs
  >;
  export interface SignupArgs {
    input?: Maybe<SignupInput>;
  }

  export type SigninResolver<
    R = UserSession,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, SigninArgs>;
  export interface SigninArgs {
    input?: Maybe<SigninInput>;
  }

  export type RequestInviteResolver<
    R = boolean,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, RequestInviteArgs>;
  export interface RequestInviteArgs {
    input?: Maybe<RequestInviteInput>;
  }

  export type CreateEventResolver<
    R = Maybe<CalendarEvent>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, CreateEventArgs>;
  export interface CreateEventArgs {
    input?: Maybe<CreateEventInput>;
  }
}

export namespace UserSessionResolvers {
  export interface Resolvers<Context = {}, TypeParent = UserSession> {
    hash?: HashResolver<string, TypeParent, Context>;

    user?: UserResolver<User, TypeParent, Context>;

    ctime?: CtimeResolver<Date, TypeParent, Context>;

    isValid?: IsValidResolver<boolean, TypeParent, Context>;
  }

  export type HashResolver<
    R = string,
    Parent = UserSession,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type UserResolver<
    R = User,
    Parent = UserSession,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type CtimeResolver<
    R = Date,
    Parent = UserSession,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type IsValidResolver<
    R = boolean,
    Parent = UserSession,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

export type UnionDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  UnionDirectiveArgs,
  {}
>;
export interface UnionDirectiveArgs {
  discriminatorField?: Maybe<string>;
}

export type AbstractEntityDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  AbstractEntityDirectiveArgs,
  {}
>;
export interface AbstractEntityDirectiveArgs {
  discriminatorField: string;
}

export type EntityDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  EntityDirectiveArgs,
  {}
>;
export interface EntityDirectiveArgs {
  embedded?: Maybe<boolean>;

  additionalFields?: Maybe<(Maybe<AdditionalEntityFields>)[]>;
}

export type ColumnDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  ColumnDirectiveArgs,
  {}
>;
export interface ColumnDirectiveArgs {
  name?: Maybe<string>;

  overrideType?: Maybe<string>;

  overrideIsArray?: Maybe<boolean>;
}

export type IdDirectiveResolver<Result> = DirectiveResolverFn<Result, {}, {}>;
export type LinkDirectiveResolver<Result> = DirectiveResolverFn<Result, {}, {}>;
export type EmbeddedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  {},
  {}
>;
export type MapDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  MapDirectiveArgs,
  {}
>;
export interface MapDirectiveArgs {
  path: string;
}

/** Directs the executor to skip this field or fragment when the `if` argument is true. */
export type SkipDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  SkipDirectiveArgs,
  {}
>;
export interface SkipDirectiveArgs {
  /** Skipped when true. */
  if: boolean;
}

/** Directs the executor to include this field or fragment only when the `if` argument is true. */
export type IncludeDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  IncludeDirectiveArgs,
  {}
>;
export interface IncludeDirectiveArgs {
  /** Included when true. */
  if: boolean;
}

/** Marks an element of a GraphQL schema as no longer supported. */
export type DeprecatedDirectiveResolver<Result> = DirectiveResolverFn<
  Result,
  DeprecatedDirectiveArgs,
  {}
>;
export interface DeprecatedDirectiveArgs {
  /** Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax (as specified by [CommonMark](https://commonmark.org/). */
  reason?: string;
}

export interface TimeZoneScalarConfig
  extends GraphQLScalarTypeConfig<TimeZone, any> {
  name: "TimeZone";
}
export interface TimestampScalarConfig
  extends GraphQLScalarTypeConfig<Timestamp, any> {
  name: "Timestamp";
}
export interface EventStatusScalarConfig
  extends GraphQLScalarTypeConfig<EventStatus, any> {
  name: "EventStatus";
}
export interface LanguageScalarConfig
  extends GraphQLScalarTypeConfig<Language, any> {
  name: "Language";
}
export interface DateScalarConfig extends GraphQLScalarTypeConfig<Date, any> {
  name: "Date";
}

export interface IResolvers<Context = {}> {
  Query?: QueryResolvers.Resolvers<Context>;
  User?: UserResolvers.Resolvers<Context>;
  CalendarEvent?: CalendarEventResolvers.Resolvers<Context>;
  EventInformation?: EventInformationResolvers.Resolvers<Context>;
  EventTime?: EventTimeResolvers.Resolvers<Context>;
  EventContactPerson?: EventContactPersonResolvers.Resolvers<Context>;
  Contact?: ContactResolvers.Resolvers<Context>;
  Location?: LocationResolvers.Resolvers<Context>;
  GeoCoordinate?: GeoCoordinateResolvers.Resolvers<Context>;
  Mutation?: MutationResolvers.Resolvers<Context>;
  UserSession?: UserSessionResolvers.Resolvers<Context>;
  TimeZone?: GraphQLScalarType;
  Timestamp?: GraphQLScalarType;
  EventStatus?: GraphQLScalarType;
  Language?: GraphQLScalarType;
  Date?: GraphQLScalarType;
}

export interface IDirectiveResolvers<Result> {
  union?: UnionDirectiveResolver<Result>;
  abstractEntity?: AbstractEntityDirectiveResolver<Result>;
  entity?: EntityDirectiveResolver<Result>;
  column?: ColumnDirectiveResolver<Result>;
  id?: IdDirectiveResolver<Result>;
  link?: LinkDirectiveResolver<Result>;
  embedded?: EmbeddedDirectiveResolver<Result>;
  map?: MapDirectiveResolver<Result>;
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}
