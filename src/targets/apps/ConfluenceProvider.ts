import { CONFLUENCE_ICON } from "../../app_icons/confluence";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class ConfluenceProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('confluence.it')
  }

  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Confluence',
      icon: CONFLUENCE_ICON,
      theme: Themes.FIGMA_BLUE
    }
  }

}