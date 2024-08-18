import { Target } from "../../target";
import { JiraTarget } from "../JIraTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class JiraProvider implements AppTargetProvider {
  
  isMatch(url: string): boolean {
    return url.includes('jira.it')
  }
  create(url: string): Target {
    return new JiraTarget(url)
  }

}