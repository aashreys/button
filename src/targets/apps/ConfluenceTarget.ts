import { CONFLUENCE_ICON } from "../../app_icons/confluence";
import { JIRA_ICON } from "../../app_icons/jira";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";


export class ConfluenceTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = CONFLUENCE_ICON
  readonly theme = Themes.FIGMA_BLUE
  readonly message = 'Click to open link'
  readonly label: string = 'Open Confluence'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}
