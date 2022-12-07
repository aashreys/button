import { MSG_TARGET_PAGE, SCHEME_PAGE } from "../constants";
import { Target, TargetType } from "./target";


export class PageTarget implements Target {

  readonly type: TargetType;
  readonly url: string;
  readonly message: string;
  readonly pageId: string;

  constructor(page: PageNode) {
    this.type = TargetType.PAGE;
    this.url = SCHEME_PAGE + page.id;
    this.message = MSG_TARGET_PAGE;
    this.pageId = page.id;
  }

}
