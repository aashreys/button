import { LOOM_ICON } from "../../app_icons/loom"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"
import { AppTargetProvider } from "./AppTargetProvider"

export class LoomProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('loom.com')
  }

  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Loom',
      icon: LOOM_ICON,
      theme: Themes.VIOLET
    }
  }

}