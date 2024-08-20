import { GOOGLE_SLIDES_ICON } from "../../app_icons/google_slides";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class GoogleSlidesProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('slides.google.com') || url.includes('docs.google.com/presentation')
  }
  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Google Slides',
      icon: GOOGLE_SLIDES_ICON,
      theme: Themes.YELLOW
    }
  }
  
}