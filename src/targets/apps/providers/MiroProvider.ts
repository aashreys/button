import { Target } from "../../target";
import { MiroTarget } from "../MiroTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class MiroProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('miro.com')
  }
  create(url: string): Target {
    return new MiroTarget(url)
  }

}