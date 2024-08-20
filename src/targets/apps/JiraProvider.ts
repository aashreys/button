import { JIRA_ICON } from "../../app_icons/jira";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class JiraProvider implements AppTargetProvider {

  private ticketRegex = /([A-Z]+\-\d+)/g
  
  isMatch(url: string): boolean {
    return url.includes('jira.it')
  }
  
  create(url: string): Target {
    const ticketNumber = url.match(this.ticketRegex)
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: ticketNumber ? ticketNumber.toString() : 'Open JIRA',
      icon: JIRA_ICON,
      theme: Themes.FIGMA_BLUE
    }
  }

}