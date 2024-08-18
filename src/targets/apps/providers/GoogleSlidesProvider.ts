import { Target } from "../../target";
import { GoogleSlidesTarget } from "../GoogleSlidesTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class GoogleSlidesProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('slides.google.com')
  }
  create(url: string): Target {
    return new GoogleSlidesTarget(url)
  }

  
}