import { CAMPSITE_ICON } from "../../app_icons/campsite"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class CampsiteTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = CAMPSITE_ICON
  readonly theme = Themes.ORANGE
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Campsite'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}