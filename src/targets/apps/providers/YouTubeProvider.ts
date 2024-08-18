import { YOUTUBE_ICON } from "../../../app_icons/youtube"
import { Themes } from "../../../themes"
import { Target, TargetType } from "../../target"
import { YouTubeTarget } from "../YouTubeTarget"
import { AppTargetProvider } from "./AppTargetProvider"

export class YouTubeProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }
  create(url: string): Target {
    return new YouTubeTarget(url)
  }

}