import { GOOGLE_SLIDES_ICON } from "../../app_icons/google_slides"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class GoogleSlidesTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = GOOGLE_SLIDES_ICON
  readonly theme = Themes.YELLOW
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open link'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

  static isAppLink(url: string) {
    return url.includes('slides.google.com')
  }

}