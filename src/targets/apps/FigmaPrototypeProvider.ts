import { FIGMA_PROTOTYPE_ICON } from "../../app_icons/figma_prototype";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class FigmaPrototypeProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('figma.com/proto/')
  }

  create(url: string): Target {
    return {
      type: TargetType.WEB,
      icon: FIGMA_PROTOTYPE_ICON,
      theme: Themes.BLACK,
      message: 'Click to open prototype',
      label: 'Open Prototype',
      url: url
    }
  }

}