import { LATTICE_ICON } from "../../app_icons/lattice"
import { Themes } from "../../themes"
import { Target, TargetType } from "../target"

export class LatticeTarget implements Target {

  readonly type = TargetType.WEB
  readonly icon = LATTICE_ICON
  readonly theme = Themes.YELLOW
  readonly message: string = 'Click to open link'
  readonly label: string = 'Open Lattice'

  readonly url: string;

  constructor(url: string) {
    this.url = url
  }

}