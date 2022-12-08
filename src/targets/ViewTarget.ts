import { SCHEME_VIEW } from "../constants";
import { Target, TargetType } from "./target";


export class ViewTarget implements Target {

  readonly type: TargetType;
  readonly url: string;
  readonly message: string;
  readonly pageId: string;
  readonly x: number;
  readonly y: number;
  readonly zoom: number;
  readonly label: string;

  constructor(page: PageNode, x: number, y: number, zoom: number) {
    this.type = TargetType.VIEW;
    this.url = SCHEME_VIEW + `${page.id},${x},${y},${zoom}`;
    this.message = `Button will navigate to current view`;
    this.pageId = page.id;
    this.x = x;
    this.y = y;
    this.zoom = zoom;
    this.label = 'Go to view ->'
  }

}
