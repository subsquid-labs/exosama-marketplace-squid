import {Store} from '@subsquid/typeorm-store'
import {ERC721Contract, ERC721Owner, ERC721Token, ERC721Transfer} from '../model'
import * as erc721 from '../abi/erc721'
import {ERC721contracts, ERC721owners, ERC721tokens, ERC721transfers} from '../utils/entitiesManager'
import {ERC721TOKEN_RELATIONS, NULL_ADDRESS} from '../utils/config'
import {getTokenId} from '../helpers'
import {LogHandlerContext} from '@subsquid/evm-processor/lib/interfaces/dataHandlers'

export async function erc721handleTransfer(
    ctx: LogHandlerContext<Store, {evmLog: {topics: true; data: true; transaction: {hash: true}}}>
): Promise<void> {
    const {evmLog, block} = ctx
    const contractAddress = evmLog.address.toLowerCase() as string
    const contractAPI = new erc721.Contract(ctx, contractAddress)
    // const contractAPI = new ethers.Contract(
    // 	contractAddress,
    // 	erc721.abi,
    // 	provider
    // );
    const data = erc721.events['Transfer(address,address,uint256)'].decode(evmLog)
    // ctx.log.info(block)
    // ctx.log.info(data)
    const numericId = data.tokenId.toBigInt()
    const tokenId = getTokenId(contractAddress, numericId)

    let oldOwner = await ERC721owners.get(ctx.store, ERC721Owner, data.from.toLowerCase())
    if (!oldOwner) {
        oldOwner = new ERC721Owner({
            id: data.from.toLowerCase(),
            balance: 0n,
        })
    }
    if (oldOwner.balance != null && oldOwner.balance > BigInt(0) && oldOwner.id !== NULL_ADDRESS) {
        oldOwner.balance -= BigInt(1)
    }
    ERC721owners.save(oldOwner)

    let owner = await ERC721owners.get(ctx.store, ERC721Owner, data.to.toLowerCase())
    if (!owner) {
        owner = new ERC721Owner({
            id: data.to.toLowerCase(),
            balance: 0n,
        })
    }
    if (owner.balance != null) {
        owner.balance += BigInt(1)
    }
    ERC721owners.save(owner)

    let contractData = await ERC721contracts.get(ctx.store, ERC721Contract, contractAddress)

    if (!contractData) {
        if (oldOwner.id === NULL_ADDRESS) {
            const [name, symbol] = await Promise.all([contractAPI.name(), contractAPI.symbol()])
            contractData = new ERC721Contract({
                id: contractAddress,
                address: contractAddress,
                totalSupply: BigInt(0),
                name,
                symbol,
                decimals: 0,
                startBlock: block.height,
                contractURIUpdated: BigInt(block.timestamp) / BigInt(1000),
            })
        } else {
            throw new Error(`Can't find contract entity for ${contractAddress}`)
        }
    }
    const contractTotalSupply =
        BigInt(data.tokenId.toBigInt()) > contractData.totalSupply
            ? BigInt(data.tokenId.toBigInt())
            : contractData.totalSupply

    contractData.totalSupply = contractTotalSupply
    ERC721contracts.save(contractData)

    const token =
        oldOwner.id !== NULL_ADDRESS
            ? ((await ERC721tokens.get(ctx.store, ERC721Token, tokenId, ERC721TOKEN_RELATIONS, true)) as ERC721Token)
            : new ERC721Token({
                  id: tokenId,
                  numericId,
                  owner,
                  contract: contractData,
                  createdAt: BigInt(block.timestamp) / BigInt(1000),
                  updatedAt: BigInt(block.timestamp) / BigInt(1000),
              })
    token.owner = owner

    ERC721tokens.save(token)

    const transferId = evmLog.transaction.hash.concat('-'.concat(tokenId)).concat('-'.concat(evmLog.index.toString()))

    const transfer = new ERC721Transfer({
        id: transferId,
        block: BigInt(block.height),
        timestamp: BigInt(block.timestamp) / BigInt(1000),
        transactionHash: evmLog.transaction.hash,
        from: oldOwner,
        to: owner,
        token,
    })

    ERC721transfers.save(transfer)
    ctx.log.info(`[ERC721Transfer] - ${tokenId} - ${transfer.id}`)
}
