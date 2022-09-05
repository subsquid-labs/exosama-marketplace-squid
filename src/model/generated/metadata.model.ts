import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Attribute} from "./_attribute"

@Entity_()
export class Metadata {
  constructor(props?: Partial<Metadata>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: true})
  name!: string | undefined | null

  @Column_("text", {nullable: true})
  description!: string | undefined | null

  @Column_("text", {nullable: true})
  image!: string | undefined | null

  @Column_("text", {nullable: true})
  externalUrl!: string | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new Attribute(undefined, marshal.nonNull(val)))}, nullable: true})
  attributes!: (Attribute)[] | undefined | null

  @Index_()
  @Column_("text", {nullable: true})
  type!: string | undefined | null

  @Column_("bool", {nullable: true})
  composite!: boolean | undefined | null

  @Column_("text", {array: true, nullable: true})
  layers!: (string)[] | undefined | null

  @Index_()
  @Column_("text", {nullable: true})
  artist!: string | undefined | null

  @Column_("text", {nullable: true})
  artistUrl!: string | undefined | null
}
