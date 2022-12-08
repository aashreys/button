import { computeMaximumBounds } from "@create-figma-plugin/utilities";
import { ERROR_EMPTY_NODES, MSG_LAYER_NOT_FOUND, MSG_NOT_SAME_PAGE, SCHEME_NODE, SCHEME_PAGE, SCHEME_VIEW } from "../constants";
import { Target } from "./target";
import { NodeTarget } from "./NodeTarget";
import { ViewTarget } from "./ViewTarget";
import { PageTarget } from "./PageTarget";
import { WebTarget } from "./WebTarget";
import { EmptyTarget } from "./EmptyTarget";
import { isOnSamePage } from "../utils";

export class TargetResolver {

  // DEPRECATED, remove when Figma supports updates to inserted widgets
  private readonly DEPRECATED_SCHEME_NODE = 'button:navigateTo -> '

  public fromUrl(url: string): Target {

    if (this.isThisFigmaFile(url) && url.toLowerCase().includes('node-id=')) {
      // URL points to this file, could be a PageNode or SceneNode
      let nodeId = this.getNodeIdFromFigmaUrl(url)
      return this.fromNodes([nodeId as string]) 
    }

    if (url.includes(SCHEME_NODE)) {
      let nodeIds = url.replace(SCHEME_NODE, '').split(',')
      return this.fromNodes(nodeIds)
    }

    if (url.includes(this.DEPRECATED_SCHEME_NODE))  {
      let nodeId = url.replace(this.DEPRECATED_SCHEME_NODE, '')
      return this.fromNodes([nodeId])
    }

    if (url.includes(SCHEME_PAGE)) {
      let pageId = url.replace(SCHEME_PAGE, '')
      let page = figma.getNodeById(pageId) as PageNode
      if (page) return new PageTarget(page)
      else throw new Error(MSG_LAYER_NOT_FOUND)
    }

    if (url.includes(SCHEME_VIEW)) {
      let viewParams = url.replace(SCHEME_VIEW, '').split(',')
      let page = figma.getNodeById(viewParams[0]) as PageNode
      if (page) {
        return this.fromView(
          page, 
          Number(viewParams[1]), 
          Number(viewParams[2]), 
          Number(viewParams[3])
        )
      }
      else throw new Error(MSG_LAYER_NOT_FOUND)
    }

    if (url.length > 0) {
      if (!url.includes(':')) url = 'https://' + url.toLowerCase()
      return new WebTarget(url)
    }

    return new EmptyTarget()

  }

  public fromNodes(nodeIds: string[]): Target {
    if (nodeIds.length === 1) return this.fromSingleNode(nodeIds[0])
    if (nodeIds.length > 1) return this.fromMultipleNodes(nodeIds)
    throw new Error(ERROR_EMPTY_NODES)
  }

  private fromSingleNode(nodeId: string): Target {
    let node = figma.getNodeById(nodeId)
    if (node && node.type === 'PAGE') {
      return new PageTarget(node as PageNode)
    }
    else if (node) {
      return new NodeTarget([node as SceneNode])
    }
    else {
      throw new Error(MSG_LAYER_NOT_FOUND)
    }
  }

  private fromMultipleNodes(nodeIds: string[]): Target {
    let nodes = nodeIds.map((id) => {
      return figma.getNodeById(id)
    }).filter((node) => { return node !== null }) as SceneNode[]

    if (nodes.length > 0 ) {
      let isSamePage = isOnSamePage(nodes)
      if (isSamePage) {
        return new NodeTarget(nodes as SceneNode[])
      } else {
        throw new Error(MSG_NOT_SAME_PAGE)
      }
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