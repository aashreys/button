import { Theme } from "../themes"

export enum TargetType {
  EMPTY, WEB, NODE, PAGE, VIEW
}

export interface Target {

  readonly type: TargetType

  readonly url: string

  readonly message: string

  readonly label: string

  readonly icon?: string

  readonly theme?: Theme

}