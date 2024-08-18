import { PRODUCTBOARD_ICON } from "../../app_icons/productboard"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class ProductboardTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = PRODUCTBOARD_ICON
  readonly theme = Themes.RED
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Productboard'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}