import { Target } from "../../target";
import { ProductboardTarget } from "../ProductboardTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class ProductboardProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('productboard.com')
  }
  create(url: string): Target {
    return new ProductboardTarget(url)
  }

}