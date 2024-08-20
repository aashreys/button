import { FIGJAM_ICON } from "../../app_icons/figjam";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class FigJamProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('figma.com/board/')
  }

  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open FigJam',
      icon: FIGJAM_ICON,
      theme: Themes.FIGJAM_PURPLE
    }
  }

}