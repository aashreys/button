import { Target } from "../../target";
import { GoogleSheetsTarget } from "../GoogleSheetsTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class GoogleSheetsProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('sheets.google.com') || url.includes('docs.google.com/spreadsheets')
  }
  create(url: string): Target {
    return new GoogleSheetsTarget(url)
  }

}