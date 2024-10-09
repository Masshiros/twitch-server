export class Follower {
  private _sourceUserId: string
  private _destinationUserId: string
  private _followDate: Date

  constructor(sourceUserId: string, destinationUserId: string) {
    this._sourceUserId = sourceUserId
    this._destinationUserId = destinationUserId
    this._followDate = new Date()
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
}
