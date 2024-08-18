import { JIRA_ICON } from "../../app_icons/jira";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";


export class JiraTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = JIRA_ICON
  readonly theme = Themes.FIGMA_BLUE
  readonly message = 'Click to open link'

  readonly url: string;
  readonly label: string;

  private ticketRegex = /([A-Z]+\-\d+)/g

  constructor(url: string) {
    this.type = TargetType.WEB;
    this.url = url;
    this.message = 'Click to open link';
    const ticketNumber = url.match(this.ticketRegex)
    this.label = (ticketNumber ? ticketNumber.toString() : 'Open JIRA')
  }

}
