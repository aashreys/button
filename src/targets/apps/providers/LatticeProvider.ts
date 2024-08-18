import { Target } from "../../target";
import { LatticeTarget } from "../LatticeTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class LatticeProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('latticehq.com')
  }

  create(url: string): Target {
    return new LatticeTarget(url)
  }

}