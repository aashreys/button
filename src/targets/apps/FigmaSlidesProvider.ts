import { FIGMA_SLIDES_ICON } from "../../app_icons/figma_slides";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class FigmaSlidesProvider implements AppTargetProvider {
  
  isMatch(url: string): boolean {
    return url.includes('figma.com/slides/')
  }

  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Figma Slides',
      icon: FIGMA_SLIDES_ICON,
      theme: Themes.RED
    }
  }

}