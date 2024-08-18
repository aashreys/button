import { Target } from "../../target";
import { AirtableTarget } from "../AirtableTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class AirtableProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('airtable.com')
  }
  create(url: string): Target {
    return new AirtableTarget(url)
  }

}