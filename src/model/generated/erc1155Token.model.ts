import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {ERC1155TokenOwner} from "./erc1155TokenOwner.model"
import {ERC1155Transfer} from "./erc1155Transfer.model"
import {ERC1155Contract} from "./erc1155Contract.model"
import {Metadata} from "./metadata.model"

@Entity_()
export class ERC1155Token {
  constructor(props?: Partial<ERC1155Token>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  numericId!: bigint

  @OneToMany_(() => ERC1155TokenOwner, e => e.token)
  owners!: ERC1155TokenOwner[]

  @Column_("text", {nullable: true})
  tokenUri!: string | undefined | null

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  updatedAt!: bigint

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  createdAt!: bigint

  @OneToMany_(() => ERC1155Transfer, e => e.token)
  transfers!: ERC1155Transfer[]

  @Column_("text", {nullable: false})
  contractId!: string

  @Index_()
  @ManyToOne_(() => ERC1155Contract, {nullable: true})
  contract!: ERC1155Contract

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  totalSupply!: bigint

  @Column_("text", {nullable: true})
  metadataId!: string | undefined | null

  @Index_()
  @ManyToOne_(() => Metadata, {nullable: true})
  metadata!: Metadata | undefined | null
}
