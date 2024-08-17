import { FIGMA_ICON } from "../../app_icons/figma";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";

export class FigmaTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = FIGMA_ICON
  readonly theme = Themes.FIGMA_BLUE
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Figma File'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

  static isAppLink(url: string) {
    return url.includes('figma.com')
  }

}