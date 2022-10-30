import { LogHandlerContext } from '@subsquid/evm-processor'
import { Store } from '@subsquid/typeorm-store'
import assert from 'assert'
import { ERC721Contract } from '../model'
import { ERC721contracts } from '../utils/entitiesManager'

export async function handleContractUri(
  ctx: LogHandlerContext<Store, {evmLog: {topics: true; data: true}; transaction: {hash: true}}>
): Promise<void> {
  const { evmLog, store, transaction, block} = ctx
  const address = (<string>evmLog.address).toLowerCase()

  const contract = await ERC721contracts.get(
    store,
    ERC721Contract,
    address,
    undefined,
    true
  )
  assert(contract)
  ERC721contracts.addToUriUpdatedBuffer(contract)

  ctx.log.info(`Collection URI will be updated - ${contract.id}`)
  ERC721contracts.save(contract)
}
