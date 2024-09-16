import { randomUUID } from 'crypto';
import { LoginHistory } from './login-histories.entity';
import { Token } from './tokens.entity';
import { EDeviceType } from '../enum/device_type.enum';

export class Device {
  private _id: string;
  private props: {
    userId: string;
    type: EDeviceType;
    name: string;
    lastUsed: Date;
    tokens: Token[];
    loginHistories: LoginHistory[];
  };

  constructor(
    props: {
      userId: string;
      type: EDeviceType;
      name: string;
      lastUsed: Date;
      tokens: Token[];
      loginHistories: LoginHistory[];
    },
    id?: string,
  ) {
    this._id = id || randomUUID();
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get type(): EDeviceType {
    return this.props.type;
  }

  get name(): string {
    return this.props.name;
  }

  get lastUsed(): Date {
    return this.props.lastUsed;
  }

  set lastUsed(dateTime: Date) {
    this.props.lastUsed = dateTime;
  }
  get tokens(): Token[] {
    return this.props.tokens;
  }

  get loginHistories(): LoginHistory[] {
    return this.props.loginHistories;
  }
}
