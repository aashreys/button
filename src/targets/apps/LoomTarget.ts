import { LOOM_ICON } from "../../app_icons/loom"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class LoomTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = LOOM_ICON
  readonly theme = Themes.FIGJAM_PURPLE
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Loom'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}