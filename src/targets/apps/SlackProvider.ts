import { SLACK_ICON } from "../../app_icons/slack";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class SlackProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('slack.com')
  }
  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Slack',
      icon: SLACK_ICON,
      theme: Themes.VIOLET
    }
  }

}