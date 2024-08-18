import { AIRTABLE_ICON } from "../../app_icons/airtable"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class AirtableTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = AIRTABLE_ICON
  readonly theme = Themes.YELLOW
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Airtable'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}