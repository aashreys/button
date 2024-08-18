import { FIGMA_SLIDES_ICON } from "../../app_icons/figma_slides";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";

export class FigmaSlidesTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = FIGMA_SLIDES_ICON
  readonly theme = Themes.RED
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Figma Slides'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}