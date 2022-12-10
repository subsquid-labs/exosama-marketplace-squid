import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import {
  assertNotNull,
  EvmBatchProcessor,
  LogHandlerContext,
} from '@subsquid/evm-processor'
import {
  erc721handleTransfer,
  handleContractUri,
  handleUri,
  handleUriAll,
} from './mappings'
import { saveAll } from './utils/entitiesManager'
import * as exosamaCollection from './abi/ExosamaCollection'
import * as config from './utils/config'
import { updateAllMetadata } from './helpers/metadata.helper'

const database = new TypeormDatabase()
const processor = new EvmBatchProcessor()
  .setBlockRange({ from: 15584000 })
  .setDataSource({
    archive: 'https://eth.archive.subsquid.io',
    chain: process.env.ETH_CHAIN_NODE ?? 'https://rpc.ankr.com/eth',
  })
  .addLog(config.EXOSAMA_ADDRESS, {
    filter: [
      [
        exosamaCollection.events.Transfer.topic,
        exosamaCollection.events.URI.topic,
        exosamaCollection.events.URIAll.topic,
        exosamaCollection.events.ContractURI.topic,
      ],
    ],
    data: {
      evmLog: {
        topics: true,
        data: true,
      },
      transaction: {
        hash: true,
      },
    },
  })

processor.run(database, async (ctx) => {
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === 'evmLog') {
        if (item.address === config.EXOSAMA_ADDRESS)
          await handleEvmLog({
            ...ctx,
            block: block.header,
            ...item,
          })
      }
    }
  }
  await updateAllMetadata({
    ...ctx,
    block: ctx.blocks[ctx.blocks.length - 1].header,
  })
  await saveAll(ctx.store)
})

async function handleEvmLog(
  ctx: LogHandlerContext<
    Store,
    { evmLog: { topics: true; data: true }; transaction: { hash: true } }
  >
) {
  const evmLog = ctx.evmLog
  const contractAddress = evmLog.address.toLowerCase()
  //ctx.log.info(evmLog)
  switch (evmLog.topics[0]) {
    case exosamaCollection.events.Transfer.topic:
      await erc721handleTransfer(ctx)
      break
    case exosamaCollection.events.URI.topic:
      await handleUri(ctx)
      break
    case exosamaCollection.events.URIAll.topic:
      await handleUriAll(ctx)
      break
    case exosamaCollection.events.ContractURI.topic:
      await handleContractUri(ctx)
      break
    default:
  }
}
