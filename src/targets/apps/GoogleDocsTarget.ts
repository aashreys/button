import { GOOGLE_DOCS_ICON } from "../../app_icons/google_docs"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class GoogleDocsTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = GOOGLE_DOCS_ICON
  readonly theme = Themes.FIGMA_BLUE
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Google Doc ↗️'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}