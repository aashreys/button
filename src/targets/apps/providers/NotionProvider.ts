import { Target } from "../../target";
import { NotionTarget } from "../NotionTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class NotionProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('notion.so')
  }
  create(url: string): Target {
    return new NotionTarget(url)
  }
  
}