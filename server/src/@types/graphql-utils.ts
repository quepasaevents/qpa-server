import {Session} from "../Auth/Session.entity"

export interface Context {
  session?: Session
  req: Express.Request
}

export type GQLResolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any

export interface ResolverMap {
  [key: string]: {
    [key: string]: GQLResolver;
  }
}
