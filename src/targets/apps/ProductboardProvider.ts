import { PRODUCTBOARD_ICON } from "../../app_icons/productboard";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class ProductboardProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('productboard.com')
  }
  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Productboard',
      icon: PRODUCTBOARD_ICON,
      theme: Themes.RED
    }
  }

}