import { YOUTUBE_ICON } from "../../app_icons/youtube"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class YouTubeTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = YOUTUBE_ICON
  readonly theme = Themes.RED
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open YouTube'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}