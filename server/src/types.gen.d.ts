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

export interface EventInput {
  time?: Maybe<EventTimeInput>;

  info?: Maybe<(Maybe<EventInformationInput>)[]>;

  location?: Maybe<EventLocationInput>;

  meta?: Maybe<EventMetaInput>;
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

export type TimeZone = any;

export type Timestamp = any;

export type EventStatus = any;

export type Language = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  me?: Maybe<User>;

  events?: Maybe<(Maybe<Event>)[]>;
}

export interface User {
  name: string;

  username: string;

  id: string;
}

export interface Event {
  id?: Maybe<string>;

  owner: User;

  info?: Maybe<(Maybe<EventInformation>)[]>;

  time?: Maybe<EventTime>;

  status: EventStatus;

  contact?: Maybe<EventContactPerson[]>;

  location?: Maybe<Location>;
}

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
  signup: boolean;

  signin: UserSession;

  requestInvite: boolean;

  createEvent?: Maybe<Event>;
}

export interface UserSession {
  hash: string;

  user: User;
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
  input?: Maybe<EventInput>;
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
    me?: MeResolver<Maybe<User>, TypeParent, Context>;

    events?: EventsResolver<Maybe<(Maybe<Event>)[]>, TypeParent, Context>;
  }

  export type MeResolver<R = Maybe<User>, Parent = {}, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type EventsResolver<
    R = Maybe<(Maybe<Event>)[]>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, EventsArgs>;
  export interface EventsArgs {
    filter?: Maybe<EventsQueryFilter>;
  }
}

export namespace UserResolvers {
  export interface Resolvers<Context = {}, TypeParent = User> {
    name?: NameResolver<string, TypeParent, Context>;

    username?: UsernameResolver<string, TypeParent, Context>;

    id?: IdResolver<string, TypeParent, Context>;
  }

  export type NameResolver<R = string, Parent = User, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type UsernameResolver<
    R = string,
    Parent = User,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type IdResolver<R = string, Parent = User, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
}

export namespace EventResolvers {
  export interface Resolvers<Context = {}, TypeParent = Event> {
    id?: IdResolver<Maybe<string>, TypeParent, Context>;

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
    R = Maybe<string>,
    Parent = Event,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type OwnerResolver<R = User, Parent = Event, Context = {}> = Resolver<
    R,
    Parent,
    Context
  >;
  export type InfoResolver<
    R = Maybe<(Maybe<EventInformation>)[]>,
    Parent = Event,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type TimeResolver<
    R = Maybe<EventTime>,
    Parent = Event,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type StatusResolver<
    R = EventStatus,
    Parent = Event,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type ContactResolver<
    R = Maybe<EventContactPerson[]>,
    Parent = Event,
    Context = {}
  > = Resolver<R, Parent, Context>;
  export type LocationResolver<
    R = Maybe<Location>,
    Parent = Event,
    Context = {}
  > = Resolver<R, Parent, Context>;
}

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
    signup?: SignupResolver<boolean, TypeParent, Context>;

    signin?: SigninResolver<UserSession, TypeParent, Context>;

    requestInvite?: RequestInviteResolver<boolean, TypeParent, Context>;

    createEvent?: CreateEventResolver<Maybe<Event>, TypeParent, Context>;
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
    R = Maybe<Event>,
    Parent = {},
    Context = {}
  > = Resolver<R, Parent, Context, CreateEventArgs>;
  export interface CreateEventArgs {
    input?: Maybe<EventInput>;
  }
}

export namespace UserSessionResolvers {
  export interface Resolvers<Context = {}, TypeParent = UserSession> {
    hash?: HashResolver<string, TypeParent, Context>;

    user?: UserResolver<User, TypeParent, Context>;
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

export interface IResolvers<Context = {}> {
  Query?: QueryResolvers.Resolvers<Context>;
  User?: UserResolvers.Resolvers<Context>;
  Event?: EventResolvers.Resolvers<Context>;
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
}

export interface IDirectiveResolvers<Result> {
  skip?: SkipDirectiveResolver<Result>;
  include?: IncludeDirectiveResolver<Result>;
  deprecated?: DeprecatedDirectiveResolver<Result>;
}
