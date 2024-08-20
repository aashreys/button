import { GOOGLE_SHEETS_ICON } from "../../app_icons/google_sheets";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class GoogleSheetsProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('sheets.google.com') || url.includes('docs.google.com/spreadsheets')
  }
  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Google Sheets',
      icon: GOOGLE_SHEETS_ICON,
      theme: Themes.GREEN  
    }
  }

}