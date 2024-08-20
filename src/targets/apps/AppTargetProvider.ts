import { Target } from "../target"

export interface AppTargetProvider {

  isMatch(url: string): boolean

  create(url: string): Target

}