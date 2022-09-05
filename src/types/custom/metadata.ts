interface IRawAttrs {
    display_type?: string
    trait_type: string
    value: string
}

export interface IRawMetadata {
    image: string
    name: string
    description: string
    external_url: string
    artist: string
    artist_url: string
    composite: string,
    layers: string[],
    type: string,
    attributes: IRawAttrs[]
  }