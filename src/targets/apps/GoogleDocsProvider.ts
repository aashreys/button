import { GOOGLE_DOCS_ICON } from "../../app_icons/google_docs";
import { Themes } from "../../themes";
import { Target, TargetType } from "../target";
import { AppTargetProvider } from "./AppTargetProvider";

export class GoogleDocsProvider implements AppTargetProvider {

  isMatch(url: string): boolean {
    return url.includes('docs.google.com/document')
  }
  create(url: string): Target {
    return {
      type: TargetType.WEB,
      url: url,
      message: 'Click to open link',
      label: 'Open Google Docs',
      icon: GOOGLE_DOCS_ICON,
      theme: Themes.FIGMA_BLUE
    }
  }
  
}