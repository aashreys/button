import { MIRO_ICON } from "../../app_icons/miro";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class MiroProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('miro.com')
  }
  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Miro',
      icon: MIRO_ICON,
      theme: Themes.YELLOW
    }
  }

}