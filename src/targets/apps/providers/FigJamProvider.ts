import { Target } from "../../target";
import { FigJamTarget } from "../FigJamTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class FigJamProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('figma.com/board/')
  }

  create(url: string): Target {
    return new FigJamTarget(url)
  }

}