export class BaseEntity {
  private _id: string
  private _createdAt: Date
  private _updatedAt: Date
  private _deletedAt: Date
  get id(): string {
    return this._id
  }
  get createdAt(): Date {
    return this._createdAt
  }
  get updatedAt(): Date {
    return this._updatedAt
  }
  get deletedAt(): Date {
    return this._deletedAt
  }
}
