import { FIGMA_FILE_ICON } from "../../app_icons/figma_file";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";

export class FigmaFileTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = FIGMA_FILE_ICON
  readonly theme = Themes.FIGMA_BLUE
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Figma File'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}