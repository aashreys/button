import { ERROR_EMPTY_NODES, MSG_LAYER_NOT_FOUND, MSG_NOT_SAME_PAGE} from "../constants";
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

    if (url.length > 0) {
      if (!url.includes(':')) url = 'https://' + url.toLowerCase()
      return new WebTarget(url)
    }
    else {
      return new EmptyTarget()
    }

  }

  public fromDeprecatedUrl(url: string): Target {
    try {
      let nodeId = url.replace(this.DEPRECATED_SCHEME_NODE, '')
      return this.fromNodes([nodeId])
    } catch (e) {
      console.error(e)
      return new EmptyTarget()
    }    
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

}