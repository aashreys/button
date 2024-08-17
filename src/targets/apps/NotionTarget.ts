import { NOTION_ICON } from "../../app_icons/notion";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";

export class NotionTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = NOTION_ICON
  readonly theme = Themes.BLACK
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open link'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

  static isAppLink(url: string) {
    return url.includes('notion.so')
  }

}