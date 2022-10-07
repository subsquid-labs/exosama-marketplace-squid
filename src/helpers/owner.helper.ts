// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { BlockHandlerContext } from '@belopash/evm-processor'
import { Store } from '@subsquid/typeorm-store'
import { ERC721Owner, ERC1155Owner } from '../model'
import { ERC721owners, ERC1155owners } from '../utils/entitiesManager'


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

export async function getOrCreateERC1155Owner(
  ctx: BlockHandlerContext<Store>,
  id: string
): Promise<ERC1155Owner> {
  let owner = await ERC1155owners.get(ctx.store, ERC1155Owner, id)
  if (!owner) {
    owner = new ERC1155Owner({
      id,
    })
  }
  // ERC1155owner.save(owner)
  return owner
}



// export function findCollectionStat(
//   ownStats: TotalOwnedNft[],
//   conctractAddress: string,
//   createIfNull: boolean
// ): TotalOwnedNft {
//   const neededStat = ownStats.find(
//     (stat) => stat.conctractAddress === conctractAddress
//   )
//   if (!neededStat) {
//     if (createIfNull) {
//       const newStat = new TotalOwnedNft({
//         conctractAddress,
//         amount: 0,
//       })
//       ownStats.push(newStat)
//       return newStat
//     }
//     throw new Error(`No items for contract ${conctractAddress}`)
//   } else return neededStat
// }
