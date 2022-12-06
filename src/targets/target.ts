import { MSG_TARGET_NODE, MSG_TARGET_PAGE, SCHEME_NODE, SCHEME_PAGE, SCHEME_VIEW } from "../constants"

export enum TargetType {
  EMPTY, WEB, NODE, PAGE, VIEW
}

export interface Target {

  readonly type: TargetType

  readonly url: string

  readonly message: string

}

export class EmptyTarget implements Target {

  readonly type: TargetType
  readonly url: string
  readonly message: string

  constructor() {
    this.type = TargetType.EMPTY
    this.url = ''
    this.message = ''
  }

}

export class WebTarget implements Target {

  readonly type: TargetType
  readonly url: string
  readonly message: string

  constructor(url: string) {
    this.type = TargetType.WEB
    this.url = url
    this.message = ''
  }

}

export class NodeTarget implements Target {

  readonly type: TargetType
  readonly url: string
  readonly message: string
  readonly nodeId: string

  constructor(node: SceneNode) {
    this.type = TargetType.NODE
    this.url = SCHEME_NODE + node.id
    this.message = MSG_TARGET_NODE
    this.nodeId = node.id
  }

}

export class PageTarget implements Target {

  readonly type: TargetType
  readonly url: string
  readonly message: string
  readonly pageId: string

  constructor(page: PageNode) {
    this.type = TargetType.PAGE
    this.url = SCHEME_PAGE + page.id
    this.message = MSG_TARGET_PAGE
    this.pageId = page.id
  }

}

export class ViewTarget implements Target {

  readonly type: TargetType
  readonly url: string
  readonly message: string

  constructor(page: PageNode, x: number, y: number, zoom: number) {
    this.type = TargetType.VIEW
    this.url = SCHEME_VIEW + `${page.id},${x},${y},${zoom}`
    this.message = MSG_TARGET_PAGE
  }

}