import { IEvent } from "@nestjs/cqrs"

export class ImagesUploadedEvent implements IEvent {
  constructor(
    public readonly imageUrl: string[],
    public readonly applicableId: string,
    public readonly actionType?: "ADD" | "UPDATE",
  ) {}
}
