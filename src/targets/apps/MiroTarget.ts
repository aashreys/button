import { MIRO_ICON } from "../../app_icons/miro";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";

export class MiroTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = MIRO_ICON
  readonly theme = Themes.YELLOW
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Miro Board'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

  static isAppLink(url: string) {
    return url.includes('miro.com')
  }

}