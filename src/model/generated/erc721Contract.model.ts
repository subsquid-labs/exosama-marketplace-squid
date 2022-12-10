import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {ERC721Token} from "./erc721Token.model"

@Entity_()
export class ERC721Contract {
    constructor(props?: Partial<ERC721Contract>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: true})
    name!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    symbol!: string | undefined | null

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalSupply!: bigint

    @OneToMany_(() => ERC721Token, e => e.contract)
    mintedTokens!: ERC721Token[]

    @Column_("text", {nullable: true})
    contractURI!: string | undefined | null

    @Column_("text", {nullable: true})
    address!: string | undefined | null

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    contractURIUpdated!: bigint | undefined | null

    @Column_("int4", {nullable: true})
    decimals!: number | undefined | null

    @Index_()
    @Column_("int4", {nullable: false})
    startBlock!: number

    @Index_()
    @Column_("text", {nullable: true})
    metadataName!: string | undefined | null

    @Column_("text", {nullable: true})
    description!: string | undefined | null

    @Column_("text", {nullable: true})
    image!: string | undefined | null

    @Column_("text", {nullable: true})
    externalLink!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    artist!: string | undefined | null

    @Column_("text", {nullable: true})
    artistUrl!: string | undefined | null
}
