import { LUCID_ICON } from "../../app_icons/lucid"
import { MIRO_ICON } from "../../app_icons/miro"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class LucidchartTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = LUCID_ICON
  readonly theme = Themes.ORANGE
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Lucidchart'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}