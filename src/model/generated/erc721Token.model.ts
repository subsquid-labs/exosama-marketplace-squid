import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {ERC721Owner} from "./erc721Owner.model"
import {ERC721Transfer} from "./erc721Transfer.model"
import {ERC721Contract} from "./erc721Contract.model"
import {Metadata} from "./metadata.model"

@Entity_()
export class ERC721Token {
  constructor(props?: Partial<ERC721Token>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  numericId!: bigint

  @Column_("text", {nullable: false})
  ownerId!: string

  @Index_()
  @ManyToOne_(() => ERC721Owner, {nullable: true})
  owner!: ERC721Owner

  @Column_("text", {nullable: true})
  tokenUri!: string | undefined | null

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  updatedAt!: bigint

  @Index_()
  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  createdAt!: bigint

  @OneToMany_(() => ERC721Transfer, e => e.token)
  transfers!: ERC721Transfer[]

  @Column_("text", {nullable: false})
  contractId!: string

  @Index_()
  @ManyToOne_(() => ERC721Contract, {nullable: true})
  contract!: ERC721Contract

  @Column_("text", {nullable: true})
  metadataId!: string | undefined | null

  @Index_()
  @ManyToOne_(() => Metadata, {nullable: true})
  metadata!: Metadata | undefined | null
}
