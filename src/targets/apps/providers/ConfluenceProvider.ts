import { Target } from "../../target";
import { ConfluenceTarget } from "../ConfluenceTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class ConfluenceProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('confluence.it')
  }

  create(url: string): Target {
    return new ConfluenceTarget(url)
  }

}