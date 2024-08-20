import { Target } from "../../target";
import { GoogleDocsTarget } from "../GoogleDocsTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class GoogleDocsProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('docs.google.com/document')
  }
  create(url: string): Target {
    return new GoogleDocsTarget(url)
  }
  
}