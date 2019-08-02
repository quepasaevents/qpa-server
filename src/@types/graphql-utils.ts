import {User} from "../Auth/User.entity"

export interface Context {
  user?: User
  req?: Express.Request
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
