import { MSG_LAYER_NOT_FOUND, MSG_NOT_SAME_PAGE } from "../constants";
import { getPage, isOnSamePage, smoothScrollToNodes, smoothScrollToPoint } from "../utils";
import { Target, TargetType } from "./target";
import { NodeTarget } from "./NodeTarget";
import { ViewTarget } from "./ViewTarget";
import { PageTarget } from "./PageTarget";
import { WebTarget } from "./WebTarget";

export class Navigator {

  public async navigateTo(target: Target): Promise<void> {
    let type = target.type
    switch (type) {
      case TargetType.WEB: return this.navigateToWebTarget(target)
      case TargetType.NODE: return this.navigateToNodeTarget(target as NodeTarget)
      case TargetType.PAGE: return this.navigateToPageTarget(target as PageTarget)
      case TargetType.VIEW: return this.navigateToViewTarget(target as ViewTarget)
      case TargetType.EMPTY: return new Promise<void>((resolve, reject) => {reject()})
    }
  }

  private navigateToWebTarget(target: WebTarget): Promise<void> {
    return new Promise<void>((resolve) => {
      figma.showUI(
        `<script>window.open('${target.url}', '_blank')</script>`,
        { visible: false }
      )
      setTimeout(resolve, 1000)
    })
  }

  private navigateToNodeTarget(target: NodeTarget): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let nodes = target.nodeIds.map((id) => {
        return figma.getNodeById(id)
      }).filter((node) => { return node !== null }) as SceneNode[]
      if (nodes.length > 0) {
        let isSamePage = isOnSamePage(nodes)
        if (isSamePage) {
          figma.currentPage = getPage(nodes[0] as SceneNode)
          smoothScrollToNodes(
            nodes as SceneNode[],
            this.getZoomScale(),
            300
          ).then(() => { resolve() })
        } else {
          reject(MSG_NOT_SAME_PAGE)
        }
      }
      else {
        reject(MSG_LAYER_NOT_FOUND)
      }
    })
  }

  private navigateToPageTarget(target: PageTarget): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let page = figma.getNodeById(target.pageId)
      if (page && page.type === 'PAGE') {
        figma.currentPage = page
        resolve()
      }
      else {
        reject(MSG_LAYER_NOT_FOUND)
      }
    })
  }

  private navigateToViewTarget(target: ViewTarget): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let page = figma.getNodeById(target.pageId)
      if (page && page.type === 'PAGE') {
        figma.currentPage = page
        smoothScrollToPoint(target.x, target.y, target.zoom, 300).then(() => {
          resolve()
        })
      }
      else {
        reject(MSG_LAYER_NOT_FOUND)
      }
    })
  }

  private getZoomScale() {
    if (figma.editorType === 'figjam') {
      return 1.4
    }
    return 1.2
  }

}