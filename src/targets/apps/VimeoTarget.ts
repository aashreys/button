import { SLACK_ICON } from "../../app_icons/slack"
import { VIMEO_ICON } from "../../app_icons/vimeo"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class VimeoTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = VIMEO_ICON
  readonly theme = Themes.VIOLET
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Vimeo'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}