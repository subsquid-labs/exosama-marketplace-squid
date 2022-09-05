import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {ERC1155Token} from "./erc1155Token.model"
import {ERC1155Owner} from "./erc1155Owner.model"

@Entity_()
export class ERC1155Transfer {
  constructor(props?: Partial<ERC1155Transfer>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  tokenId!: string

  @Index_()
  @ManyToOne_(() => ERC1155Token, {nullable: true})
  token!: ERC1155Token

  @Column_("text", {nullable: false})
  fromId!: string

  @Index_()
  @ManyToOne_(() => ERC1155Owner, {nullable: true})
  from!: ERC1155Owner

  @Column_("text", {nullable: false})
  toId!: string

  @Index_()
  @ManyToOne_(() => ERC1155Owner, {nullable: true})
  to!: ERC1155Owner

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  value!: bigint

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  timestamp!: bigint

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  block!: bigint

  @Index_()
  @Column_("text", {nullable: false})
  transactionHash!: string
}
