import { MSG_LAYER_NOT_FOUND } from "../constants";
import { getPage, smoothScrollToNode, smoothScrollToPoint } from "../utils";
import { NodeTarget, PageTarget, Target, TargetType, ViewTarget, WebTarget } from "./target";

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
      let node = figma.getNodeById(target.nodeId)
      if (node) {
        figma.currentPage = getPage(node as SceneNode)
        smoothScrollToNode(node as SceneNode, 300).then(() => {
          resolve()
        })
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

}