import { ERROR_EMPTY_NODES, MSG_TARGET_NODE, SCHEME_NODE } from "../constants";
import { Target, TargetType } from "./target";


export class NodeTarget implements Target {

  readonly type: TargetType
  readonly url: string
  readonly message: string
  readonly nodeIds: string[]

  constructor(nodes: SceneNode[]) {
    if (nodes.length > 0) {
      this.type = TargetType.NODE
      this.message = MSG_TARGET_NODE
      this.nodeIds = nodes.map((node) => { return node.id })
      this.url = SCHEME_NODE + this.nodeIds.join(',')
    } else {
      throw new Error(ERROR_EMPTY_NODES)
    }
  }

}
