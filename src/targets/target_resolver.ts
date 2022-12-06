import { MSG_LAYER_NOT_FOUND, SCHEME_NODE, SCHEME_PAGE, SCHEME_VIEW } from "../constants";
import { EmptyTarget, NodeTarget, PageTarget, Target, ViewTarget, WebTarget } from "./target";

export class TargetResolver {

  public fromUrl(url: string): Target {

    if (this.isThisFigmaFile(url) && url.toLowerCase().includes('node-id=')) {
      // URL points to this file, could be a PageNode or SceneNode
      let nodeId = this.getNodeIdFromFigmaUrl(url)
      return this.fromNode(nodeId as string) 
    }

    if (url.includes(SCHEME_NODE)) {
      let nodeId = url.replace(SCHEME_NODE, '')
      let node = figma.getNodeById(nodeId) as SceneNode
      if (node) return new NodeTarget(node)
      else throw new Error(MSG_LAYER_NOT_FOUND)
    }

    if (url.includes(SCHEME_PAGE)) {
      let pageId = url.replace(SCHEME_PAGE, '')
      let page = figma.getNodeById(pageId) as PageNode
      if (page) return new PageTarget(page)
      else throw new Error(MSG_LAYER_NOT_FOUND)
    }

    if (url.length > 0) {
      if (!url.includes(':')) url = 'https://' + url.toLowerCase()
      return new WebTarget(url)
    }

    return new EmptyTarget()

  }

  public fromNode(nodeId: string): Target {
    let node = figma.getNodeById(nodeId)
    if (node && node.type === 'PAGE') {
      return new PageTarget(node as PageNode)
    }
    else if (node) {
      return new NodeTarget(node as SceneNode)
    }
    else {
      throw new Error(MSG_LAYER_NOT_FOUND)
    }
  }

  public fromView(page: PageNode, x: number, y: number, zoom: number) {
    return new ViewTarget(page, x, y, zoom)
  }

  private getNodeIdFromFigmaUrl(url: string): string | null {
    url = url.toLowerCase()
    let startIndex: number = url.indexOf('node-id=') + 8
    let endIndex: number = url.indexOf('&', startIndex)
    if (startIndex) {
      if (endIndex > 0) {
        return url.substring(startIndex, endIndex).replace('%3a', ':')
      } else {
        return url.substring(startIndex).replace('%3a', ':')
      }
    } else {
      return null
    }
  }

  private isThisFigmaFile(url: string) {
    if (url.toLowerCase().includes('figma.com')) {
      let formattedFilename = figma.root.name.trim()
      formattedFilename = encodeURIComponent(formattedFilename).replace(/%20/g, '-')
      return url.includes(formattedFilename)
    } else {
      return false
    }
  }

}