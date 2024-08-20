import { YOUTUBE_ICON } from "../../app_icons/youtube"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"
import { AppTargetProvider } from "./AppTargetProvider"

export class YouTubeProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }
  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open YouTube',
      icon: YOUTUBE_ICON,
      theme: Themes.RED
    }
  }

}