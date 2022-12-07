import { Target, TargetType } from "./target";


export class WebTarget implements Target {

  readonly type: TargetType;
  readonly url: string;
  readonly message: string;
  readonly label: string;

  constructor(url: string) {
    this.type = TargetType.WEB;
    this.url = url;
    this.message = '';
    this.label = 'Open link 🔗'
  }

}
