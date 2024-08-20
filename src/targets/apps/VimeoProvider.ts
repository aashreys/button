import { VIMEO_ICON } from "../../app_icons/vimeo"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"
import { AppTargetProvider } from "./AppTargetProvider"

export class VimeoProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('vimeo.com')
  }

  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Vimeo',
      icon: VIMEO_ICON,
      theme: Themes.FIGMA_BLUE
    }
  }

}