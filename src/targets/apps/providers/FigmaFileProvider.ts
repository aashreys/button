import { Target } from "../../target";
import { FigmaFileTarget } from "../FigmaFileTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class FigmaFileProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('figma.com/design/')
  }

  create(url: string): Target {
    return new FigmaFileTarget(url)
  }

}