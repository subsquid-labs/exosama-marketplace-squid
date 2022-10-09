import { Store, EntityClass } from '@subsquid/typeorm-store'
import assert from 'assert'
import { FindOptionsRelations, FindOptionsWhere } from 'typeorm'

import {
  ERC721Contract,
  ERC721Owner,
  ERC721Token,
  ERC721Transfer,
  Metadata,
} from '../model'
import { ERC721TOKEN_RELATIONS } from './config'

export interface EntityWithId {
  id: string
}

export class EntitiesBuffer<Entity extends EntityWithId> {
  protected saveBuffer: Map<string, Entity> = new Map()

  save(entity: Entity): void {
    this.saveBuffer.set(entity.id, entity)
  }

  getBuffer(): Array<Entity> {
    return [...this.saveBuffer.values()]
  }

  async saveAll(db: Store): Promise<void> {
    await db.save([...this.saveBuffer.values()])
    this.saveBuffer.clear()
  }
}

export class EntitiesCache<
  Entity extends EntityWithId
> extends EntitiesBuffer<Entity> {
  protected cache: Map<string, Entity> = new Map()

  protected uriUpdatedBuffer = new Map<string, Entity>()

  hasToUpdate(entitiy: Entity): boolean {
    return this.uriUpdatedBuffer.has(entitiy.id)
  }

  addToUriUpdatedBuffer(entitiy: Entity): void {
    this.uriUpdatedBuffer.set(entitiy.id, entitiy)
  }

  delFromUriUpdatedBuffer(entitiy: Entity): void {
    this.uriUpdatedBuffer.delete(entitiy.id)
  }

  getUriUpdateBuffer(): Array<Entity> {
    return [...this.uriUpdatedBuffer.values()]
  }

  protected addCache(entity: Entity): void {
    this.cache.set(entity.id, entity)
  }

  save(entity: Entity): void {
    this.saveBuffer.set(entity.id, entity)
    this.addCache(entity)
  }

  async get(
    db: Store,
    entity: EntityClass<Entity>,
    id: string,
    relations?: FindOptionsRelations<Entity>,
    dieIfNull?: boolean
  ): Promise<Entity | undefined> {
    let item = this.cache.get(id)
    if (!item) {
      item = await db.get(entity, {
        where: { id } as FindOptionsWhere<Entity>,
        relations,
      })
    }
    if (item) {
      this.addCache(item)
    } else if (dieIfNull) {
      throw new Error('Not null assertion')
    }
    return item
  }

  async saveAll(db: Store, clear?: boolean): Promise<void> {
    await db.save([...this.saveBuffer.values()])
    this.saveBuffer.clear()
    if (clear) {
      this.cache.clear()
    }
  }
}

class ERC721TokenCache extends EntitiesCache<ERC721Token> {
  async getAllContractTokens(
    db: Store,
    contractAddress: string
  ): Promise<Array<ERC721Token>> {
    const cachedTokens: ERC721Token[] = []
    this.cache.forEach((token, tokenId) => {
      if (tokenId.startsWith(contractAddress)) {
        cachedTokens.push(token)
      }
    })
    const allTokens = await db.find(ERC721Token, {
      where: {
        contract: {
          id: contractAddress,
        },
      },
      relations: ERC721TOKEN_RELATIONS,
    })

    // Replace db tokens that exists in cache
    cachedTokens.forEach((token) => {
      const replaceId = allTokens.findIndex(
        (dbToken) => dbToken.id === token.id
      )
      if (replaceId >= 0) allTokens[replaceId] = token
      else allTokens.push(token)
    })

    // Add everything from db to in-memory cache
    allTokens.forEach((token) => {
      this.addCache(token)
    })

    return allTokens
  }
}

export const ERC721contracts = new EntitiesCache<ERC721Contract>()
export const ERC721owners = new EntitiesCache<ERC721Owner>()
export const ERC721tokens = new ERC721TokenCache()
export const ERC721transfers = new EntitiesCache<ERC721Transfer>()

export const metadatas = new EntitiesCache<Metadata>()

export async function saveAll(db: Store): Promise<void> {
  await metadatas.saveAll(db, true)
  await ERC721owners.saveAll(db, true)
  await ERC721contracts.saveAll(db, true)
  await ERC721tokens.saveAll(db, true)
  await ERC721transfers.saveAll(db, true)
}
