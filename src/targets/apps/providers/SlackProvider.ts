import { Target } from "../../target";
import { SlackTarget } from "../SlackTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class SlackProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('slack.com')
  }
  create(url: string): Target {
    return new SlackTarget(url)
  }

}