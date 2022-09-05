import assert from "assert"
import * as marshal from "./marshal"

export class Attribute {
  private _displayType!: string | undefined | null
  private _traitType!: string
  private _value!: string

  constructor(props?: Partial<Omit<Attribute, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._displayType = json.displayType == null ? undefined : marshal.string.fromJSON(json.displayType)
      this._traitType = marshal.string.fromJSON(json.traitType)
      this._value = marshal.string.fromJSON(json.value)
    }
  }

  get displayType(): string | undefined | null {
    return this._displayType
  }

  set displayType(value: string | undefined | null) {
    this._displayType = value
  }

  get traitType(): string {
    assert(this._traitType != null, 'uninitialized access')
    return this._traitType
  }

  set traitType(value: string) {
    this._traitType = value
  }

  get value(): string {
    assert(this._value != null, 'uninitialized access')
    return this._value
  }

  set value(value: string) {
    this._value = value
  }

  toJSON(): object {
    return {
      displayType: this.displayType,
      traitType: this.traitType,
      value: this.value,
    }
  }
}
