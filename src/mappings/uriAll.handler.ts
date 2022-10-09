import { LogHandlerContext } from '@belopash/evm-processor'
import { Store } from '@subsquid/typeorm-store'
import { ERC721tokens } from '../utils/entitiesManager'

export async function handleUriAll(
  ctx: LogHandlerContext<
    Store,
    { evmLog: { topics: true; data: true }; transaction: { hash: true } }
  >
): Promise<void> {
  const { evmLog, store, transaction, block } = ctx
  const address = (<string>evmLog.address).toLowerCase()
  const updatedTokens = await ERC721tokens.getAllContractTokens(store, address)

  updatedTokens.forEach((token) => {
    ERC721tokens.addToUriUpdatedBuffer(token)
    ERC721tokens.save(token)
  })

  ctx.log.info(`All tokens of the contract will be updated - ${address}`)
}
