import { Target } from "../../target";
import { FigmaSlidesTarget } from "../FigmaSlidesTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class FigmaSlidesProvider implements AppTargetProvider {
  
  isMatch(url: string): boolean {
    return url.includes('figma.com/slides/')
  }

  create(url: string): Target {
    return new FigmaSlidesTarget(url)
  }

}