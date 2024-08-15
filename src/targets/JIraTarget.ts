import { JIRA_ICON } from "../app_icons/jira";
import { Themes } from "../themes";
import { Target, TargetType } from "./target";


export class JiraTarget implements Target {

  readonly type: TargetType;
  readonly url: string;
  readonly message: string;
  readonly label: string;
  readonly icon = JIRA_ICON
  readonly theme = Themes.FIGMA_BLUE

  private ticketRegex = /([A-Z]+\-\d+)/g

  constructor(url: string) {
    this.type = TargetType.WEB;
    this.url = url;
    this.message = 'Click to open link';
    const ticketNumber = url.match(this.ticketRegex)
    this.label = ticketNumber ? ticketNumber.toString() : 'Open JIRA'
  }

}
