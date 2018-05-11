export interface Session {
  createdAt: Date
  ttlMs: number
  expired: boolean
  authMethod: string
  hash: string
  userAgent: string
  location: string
}

interface DBEntity {
  id?: string
  ctime?: number,
}

interface UserKeys {
  username?: string
  email?: string
}
interface UserProperties extends UserKeys {
  name: string
}

interface User extends UserKeys, DBEntity {
}
