import { Size, Sizes } from "./sizes"

export class Migration {

  static readonly LATEST_VERSION = 3

  static getClosestSize(fontSize: number, sizes: Size[]): Size {
    let diff = Infinity
    let closestSize = Sizes.getDefaultSize()
    for (let size of sizes) {
      if (Math.abs(fontSize - size.fontSize) <= diff) {
        closestSize = size
        diff = Math.abs(fontSize - size.fontSize)
      }
    }
    return closestSize
  }

}

