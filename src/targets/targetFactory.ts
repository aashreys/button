import { ERROR_EMPTY_NODES, MSG_LAYER_NOT_FOUND, MSG_NOT_SAME_PAGE} from "../constants";
import { Target } from "./target";
import { NodeTarget } from "./NodeTarget";
import { ViewTarget } from "./ViewTarget";
import { PageTarget } from "./PageTarget";
import { WebTarget } from "./WebTarget";
import { EmptyTarget } from "./EmptyTarget";
import { isOnSamePage } from "../utils";
import { FigmaFileProvider } from "./apps/providers/FigmaFileProvider";
import { GoogleDocsProvider } from "./apps/providers/GoogleDocsProvider";
import { AppTargetProvider } from "./apps/providers/AppTargetProvider";
import { GoogleSheetsProvider } from "./apps/providers/GoogleSheetsProvider";
import { GoogleSlidesProvider } from "./apps/providers/GoogleSlidesProvider";
import { JiraProvider } from "./apps/providers/JiraProvider";
import { SlackProvider } from "./apps/providers/SlackProvider";
import { NotionProvider } from "./apps/providers/NotionProvider";
import { MiroProvider } from "./apps/providers/MiroProvider";
import { FigJamProvider } from "./apps/providers/FigJamProvider";
import { FigmaSlidesProvider } from "./apps/providers/FigmaSlidesProvider";
import { ConfluenceProvider } from "./apps/providers/ConfluenceProvider";
import { AirtableProvider } from "./apps/providers/AirtableProvider";
import { GoogleDriveProvider } from "./apps/providers/GoogleDriveProvider";
import { LatticeProvider } from "./apps/providers/LatticeProvider";
import { ProductboardProvider } from "./apps/providers/ProductboardProvider";
import { LucidProvider } from "./apps/providers/LucidchartProvider";
import { CampsiteProvider } from "./apps/providers/CampsiteProvider";
import { YouTubeProvider } from "./apps/providers/YouTubeProvider";
import { LoomProvider } from "./apps/providers/LoomProvider";
import { VimeoProvider } from "./apps/providers/VimeoProvider";
import { FigmaPrototypeProvider } from "./apps/providers/FigmaPrototypeProvider";

export class TargetResolver {

  // DEPRECATED, remove when Figma supports updates to inserted widgets
  private readonly DEPRECATED_SCHEME_NODE = 'button:navigateTo -> '

  private readonly appTargetProviders: AppTargetProvider[] = [
    new FigmaFileProvider(),
    new FigJamProvider(),
    new FigmaSlidesProvider(),
    new FigmaPrototypeProvider(),
    new GoogleDocsProvider(),
    new GoogleSheetsProvider(),
    new GoogleSlidesProvider(),
    new GoogleDriveProvider(),
    new YouTubeProvider(),
    new LoomProvider(),
    new VimeoProvider(),
    new JiraProvider(),
    new ConfluenceProvider(),
    new MiroProvider(),
    new NotionProvider(),
    new SlackProvider(),
    new AirtableProvider(),
    new LatticeProvider(),
    new ProductboardProvider(),
    new LucidProvider(),
    new CampsiteProvider(),
  ]

  public fromUrl(url: string): Target {
    if (url.length > 0) {
      if (!url.includes(':')) url = 'https://' + url.toLowerCase()
      for (let provider of this.appTargetProviders) {
        if (provider.isMatch(url)) return provider.create(url)
      }
      return new WebTarget(url)
    }
    else {
      return new EmptyTarget()
    }
  }

  public async fromDeprecatedUrl(url: string): Promise<Target> {
    try {
      let nodeId = url.replace(this.DEPRECATED_SCHEME_NODE, '')
      return await this.fromNodes([nodeId])
    } catch (e) {
      console.error(e)
      return new EmptyTarget()
    }    
  }

  public async fromNodes(nodeIds: string[]): Promise<Target> {
    if (nodeIds.length === 1) return await this.fromSingleNode(nodeIds[0])
    if (nodeIds.length > 1) return await this.fromMultipleNodes(nodeIds)
    throw new Error(ERROR_EMPTY_NODES)
  }

  private async fromSingleNode(nodeId: string): Promise<Target> {
    console.log('fromSingleNode')
    let node = await figma.getNodeByIdAsync(nodeId)
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

  private async fromMultipleNodes(nodeIds: string[]): Promise<Target> {
    console.log('fromMultipleNodes')
    let nodes: SceneNode[] = []
    for (let nodeId of nodeIds) {
      let node = await figma.getNodeByIdAsync(nodeId) as SceneNode
      if (node) nodes.push(node)
    }
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