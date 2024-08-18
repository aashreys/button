import { Target } from "../../target"
import { LucidchartTarget as LucidTarget } from "../LucidchartTarget"
import { AppTargetProvider } from "./AppTargetProvider"

export class LucidProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('lucid.app')
  }

  create(url: string): Target {
    return new LucidTarget(url)
  }

}