import { GOOGLE_DRIVE_ICON } from "../../app_icons/google_drive"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class GoogleDriveTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = GOOGLE_DRIVE_ICON
  readonly theme = Themes.GREEN
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Google Drive'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}