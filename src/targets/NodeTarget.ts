import { ERROR_EMPTY_NODES, SCHEME_NODE } from "../constants";
import { Target, TargetType } from "./target";


export class NodeTarget implements Target {

  readonly type: TargetType
  readonly url: string
  readonly message: string
  readonly nodeIds: string[]
  readonly label: string

  constructor(nodes: SceneNode[]) {
    if (nodes.length > 0) {
      this.type = TargetType.NODE
      this.message = nodes.length > 1 
      ? `Click to navigate to selected layers`
      : `Click to navigate to ${nodes[0].name}`
      this.nodeIds = nodes.map((node) => { return node.id })
      this.url = ''
      this.label = nodes.length > 1 
      ? `Go to layers ->`
      : `Go to layer ->`
    } else {
      throw new Error(ERROR_EMPTY_NODES)
    }
  }

}
