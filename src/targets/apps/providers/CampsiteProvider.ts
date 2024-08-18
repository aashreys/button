import { Target } from "../../target"
import { CampsiteTarget } from "../CampsiteTarget"
import { AppTargetProvider } from "./AppTargetProvider"

export class CampsiteProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return (url.includes('campsite.co') || url.includes('campsite.design'))
  }

  create(url: string): Target {
    return new CampsiteTarget(url)
  }

}