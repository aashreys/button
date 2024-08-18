import { SLACK_ICON } from "../../app_icons/slack"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class SlackTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = SLACK_ICON
  readonly theme = Themes.GREEN
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Slack'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}