import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {ERC1155Owner} from "./erc1155Owner.model"
import {ERC1155Token} from "./erc1155Token.model"

@Entity_()
export class ERC1155TokenOwner {
  constructor(props?: Partial<ERC1155TokenOwner>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  ownerId!: string

  @Index_()
  @ManyToOne_(() => ERC1155Owner, {nullable: true})
  owner!: ERC1155Owner

  @Column_("text", {nullable: false})
  tokenId!: string

  @Index_()
  @ManyToOne_(() => ERC1155Token, {nullable: true})
  token!: ERC1155Token

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  balance!: bigint
}
