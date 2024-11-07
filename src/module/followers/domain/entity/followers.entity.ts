export class Follower {
  private _sourceUserId: string
  private _destinationUserId: string
  private _followDate: Date
  private _createdAt: Date
  private _updatedAt: Date
  private _deletedAt: Date

  constructor(
    sourceUserId: string,
    destinationUserId: string,
    createdAt?: Date,
    updatedAt?: Date,
    deletedAt?: Date,
  ) {
    this._sourceUserId = sourceUserId
    this._destinationUserId = destinationUserId
    this._followDate = new Date()
    this._createdAt = createdAt ?? new Date()
    this._updatedAt = updatedAt
    this._deletedAt = deletedAt
  }
  // Getters
  get sourceUserId(): string {
    return this._sourceUserId
  }
  set sourceUserId(value: string) {
    this._sourceUserId = value
  }

  get destinationUserId(): string {
    return this._destinationUserId
  }
  set destinationUserId(value: string) {
    this._destinationUserId = value
  }

  get followDate(): Date {
    return this._followDate
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get updatedAt(): Date {
    return this._updatedAt
  }
  set updatedAt(value: Date) {
    this._updatedAt = value
  }
  get deletedAt(): Date {
    return this._deletedAt
  }
  set deletedAt(value: Date) {
    this._deletedAt = value
  }
}
