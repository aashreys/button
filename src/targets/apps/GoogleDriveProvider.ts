import { GOOGLE_DRIVE_ICON } from "../../app_icons/google_drive";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class GoogleDriveProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('drive.google.com')
  }
  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Google Drive',
      icon: GOOGLE_DRIVE_ICON,
      theme: Themes.FIGMA_BLUE
    }
  }

}