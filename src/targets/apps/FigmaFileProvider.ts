import { FIGMA_FILE_ICON } from "../../app_icons/figma_file";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class FigmaFileProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('figma.com/design/')
  }

  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Figma File',
      icon: FIGMA_FILE_ICON,
      theme: Themes.FIGMA_BLUE
    }
  }

}