import { NOTION_ICON } from "../../app_icons/notion";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class NotionProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('notion.so')
  }
  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Notion',
      icon: NOTION_ICON,
      theme: Themes.BLACK
    }
  }
  
}