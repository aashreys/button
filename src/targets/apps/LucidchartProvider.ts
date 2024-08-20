import { LUCID_ICON } from "../../app_icons/lucid"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"
import { AppTargetProvider } from "./AppTargetProvider"

export class LucidProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('lucid.app')
  }

  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Lucidchart',
      icon: LUCID_ICON,
      theme: Themes.ORANGE
    }
  }

}