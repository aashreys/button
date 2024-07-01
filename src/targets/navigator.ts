import { MSG_LAYER_NOT_FOUND, MSG_NOT_SAME_PAGE, NAV_DURATION } from "../constants";
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
      case TargetType.EMPTY: throw('')
    }
  }

  private navigateToWebTarget(target: WebTarget): Promise<void> {
    return new Promise<void>((resolve) => {
      figma.showUI(
        `<script>window.open('${target.url}', '_blank')</script>`,
        { visible: false }
      )
      setTimeout(resolve, 500)
    })
  }

  private async navigateToNodeTarget(target: NodeTarget) {
    let nodes: SceneNode[] = []
    for (let nodeId of target.nodeIds) {
      let node = await figma.getNodeByIdAsync(nodeId) as SceneNode
      if (node) nodes.push(node)
    }
    if (nodes.length > 0) {
      let isSamePage = isOnSamePage(nodes)
      console.log('isSamePage: ' + isSamePage)
      if (isSamePage) {
        await figma.setCurrentPageAsync(getPage(nodes[0] as SceneNode))
        await smoothScrollToNodes(
          nodes as SceneNode[],
          this.getZoomScale(),
          NAV_DURATION
        )
      } else {
        throw (MSG_NOT_SAME_PAGE)
      }
    }
    else {
      throw (MSG_LAYER_NOT_FOUND)
    }
  }

  private async navigateToPageTarget(target: PageTarget) {
    let page = await figma.getNodeByIdAsync(target.pageId)
    if (page && page.type === 'PAGE') {
      await figma.setCurrentPageAsync(page)
    }
    else {
      throw(MSG_LAYER_NOT_FOUND)
    }
  }

  private async navigateToViewTarget(target: ViewTarget) {
    let page = await figma.getNodeByIdAsync(target.pageId)
    if (page && page.type === 'PAGE') {
      await figma.setCurrentPageAsync(page)
      await smoothScrollToPoint(target.x, target.y, target.zoom, NAV_DURATION)
    }
    else {
      throw(MSG_LAYER_NOT_FOUND)
    }
  }

  private getZoomScale() {
    return figma.editorType === 'figjam' ? 1.4 : 1.7
  }

}