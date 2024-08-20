import { AIRTABLE_ICON } from "../../app_icons/airtable";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class AirtableProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('airtable.com')
  }
  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Airtable',
      icon: AIRTABLE_ICON,
      theme: Themes.YELLOW
    }
  }

}