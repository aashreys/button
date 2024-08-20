import { CAMPSITE_ICON } from "../../app_icons/campsite"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"
import { AppTargetProvider } from "./AppTargetProvider"

export class CampsiteProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return (url.includes('campsite.co') || url.includes('campsite.design'))
  }

  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Campsite',
      icon: CAMPSITE_ICON,
      theme: Themes.ORANGE  
    }
  }

}