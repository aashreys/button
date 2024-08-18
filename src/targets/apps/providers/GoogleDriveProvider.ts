import { Target } from "../../target";
import { GoogleDriveTarget } from "../GoogleDriveTarget";
import { AppTargetProvider } from "./AppTargetProvider";

export class GoogleDriveProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('drive.google.com')
  }
  create(url: string): Target {
    return new GoogleDriveTarget(url)
  }

}