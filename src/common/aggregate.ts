import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

export abstract class BaseAggregate {
  @IsUUID()
  protected _id: string;

  @Type(() => Date)
  @IsDate()
  protected _createdAt: Date = new Date();

  @Type(() => Date)
  @IsDate()
  protected _updatedAt: Date = new Date();

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  protected _deletedAt?: Date;

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  set deletedAt(value: Date | undefined) {
    this._deletedAt = value;
  }
}
