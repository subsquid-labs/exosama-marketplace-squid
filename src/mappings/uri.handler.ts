import { LogHandlerContext } from '@subsquid/evm-processor'
import { Store } from '@subsquid/typeorm-store'
import assert from 'assert'
import { getTokenId } from '../helpers'
import { ERC721Token } from '../model'
import * as exosamaCollection from '../abi/ExosamaCollection'
import { ERC721TOKEN_RELATIONS } from '../utils/config'
import { ERC721tokens } from '../utils/entitiesManager'

export async function handleUri(
  ctx: LogHandlerContext<
    Store,
    { evmLog: { topics: true; data: true }; transaction: { hash: true } }
  >
): Promise<void> {
  const { evmLog, store, transaction, block } = ctx
  const address = (<string>evmLog.address).toLowerCase()
  const { tokenId } = exosamaCollection.events.URI.decode(evmLog)
  const tokenAddress = getTokenId(address, tokenId.toBigInt())
  const token = await ERC721tokens.get(
    store,
    ERC721Token,
    tokenAddress,
    ERC721TOKEN_RELATIONS,
    true
  )
  assert(token)
  ERC721tokens.addToUriUpdatedBuffer(token)
  ctx.log.info(`Token URI will be updated - ${token.id}`)
  ERC721tokens.save(token)
}
