// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { BlockHandlerContext } from '@subsquid/evm-processor'
import { Store } from '@subsquid/typeorm-store'
import { ERC721Owner } from '../model'
import { ERC721owners } from '../utils/entitiesManager'


export async function getOrCreateERC721Owner(
  ctx: BlockHandlerContext<Store>,
  id: string
): Promise<ERC721Owner> {
  let owner = await ERC721owners.get(ctx.store, ERC721Owner, id)
  if (!owner) {
    owner = new ERC721Owner({
      id,
      balance: 0n,
    })
  }
  // ERC721owners.save(owner)
  return owner
}

