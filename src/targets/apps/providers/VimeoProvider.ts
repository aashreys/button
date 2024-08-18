import { Target } from "../../target"
import { VimeoTarget } from "../VimeoTarget"
import { AppTargetProvider } from "./AppTargetProvider"

export class VimeoProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('vimeo.com')
  }

  create(url: string): Target {
    return new VimeoTarget(url)
  }

}