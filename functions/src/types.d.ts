export interface Session {
  createdAt: Date
  ttlMs: number
  expired: boolean
  authMethod: string
  hash: string
  userAgent: string
  location: string
}

export interface SessionInvite {
  oneTimeKey: string
  userId: string
}

interface DBEntity {
  id?: string
}

interface UserKeys {
  username: string,
  email: string
}
interface UserProperties extends UserKeys {
  name: string
}

interface User extends UserKeys, DBEntity {
}
