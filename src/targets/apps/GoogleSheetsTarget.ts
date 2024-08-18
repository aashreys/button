
import { GOOGLE_SHEETS_ICON } from "../../app_icons/google_sheets"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class GoogleSheetsTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = GOOGLE_SHEETS_ICON
  readonly theme = Themes.GREEN
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Google Sheets ↗️'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }
  
}