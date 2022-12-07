import { Target, TargetType } from "./target";


export class EmptyTarget implements Target {

  readonly type: TargetType;
  readonly url: string;
  readonly message: string;

  constructor() {
    this.type = TargetType.EMPTY;
    this.url = '';
    this.message = '';
  }

}
