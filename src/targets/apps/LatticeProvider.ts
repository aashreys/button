import { LATTICE_ICON } from "../../app_icons/lattice";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class LatticeProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('latticehq.com')
  }

  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Lattice',
      icon: LATTICE_ICON,
      theme: Themes.YELLOW
    }
  }

}