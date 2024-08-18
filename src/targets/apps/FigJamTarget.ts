import { FIGJAM_ICON } from "../../app_icons/figjam";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";

export class FigJamTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = FIGJAM_ICON
  readonly theme = Themes.FIGJAM_PURPLE
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open FigJam'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}