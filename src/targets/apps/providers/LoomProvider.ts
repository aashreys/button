import { Target } from "../../target"
import { LoomTarget } from "../LoomTarget"
import { AppTargetProvider } from "./AppTargetProvider"

export class LoomProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('loom.com')
  }

  create(url: string): Target {
    return new LoomTarget(url)
  }

}