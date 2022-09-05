import {Store, TypeormDatabase} from '@subsquid/typeorm-store'
import {EvmBatchProcessor, LogHandlerContext} from '@subsquid/evm-processor'
import {erc721handleTransfer} from './mappings'
import {saveAll} from './utils/entitiesManager'
import * as erc721 from './abi/erc721'
import * as erc1155 from './abi/erc1155'
import * as config from './utils/config'
import {updateAllMetadata} from './helpers/metadata.helper'

const database = new TypeormDatabase()
const processor = new EvmBatchProcessor()
    .setBlockRange({from: 15584000})
    .setDataSource({
        archive: 'https://eth-test.archive.subsquid.io',
        chain: 'wss://mainnet.infura.io/ws/v3/c8458927a73148cfab30014f6e422bb3',
    })
    .addLog(config.EXOSAMA_ADDRESS, {
        filter: [[erc721.events['Transfer(address,address,uint256)'].topic]],
        data: {
            evmLog: {
                topics: true,
                data: true,
                transaction: {
                    hash: true,
                },
            },
        },
    })

processor.run(database, async (ctx) => {
    for (const block of ctx.blocks) {
        for (const item of block.items) {
            if (item.kind === 'evmLog') {
                if (item.address === '0xac5c7493036de60e63eb81c5e9a440b42f47ebf5') {
                    await erc721handleTransfer({
                        ...ctx,
                        block: block.header,
                        evmLog: item.evmLog,
                    })
                }
            }
        }
    }
    await updateAllMetadata({
        ...ctx,
        block: ctx.blocks[ctx.blocks.length - 1].header,
    })
    await saveAll(ctx.store)
})
