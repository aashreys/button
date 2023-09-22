import { SCHEME_PAGE } from "../constants";
import { Target, TargetType } from "./target";


export class PageTarget implements Target {

  readonly type: TargetType;
  readonly url: string;
  readonly message: string;
  readonly pageId: string;
  readonly label: string;

  constructor(page: PageNode) {
    this.type = TargetType.PAGE;
    this.url = ''
    this.message = `Click to navigate to page ${page.name}`;
    this.pageId = page.id;
    this.label = 'Go to page ->'
  }

}
