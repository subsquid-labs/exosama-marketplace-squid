
export const EXOSAMA_ADDRESS = '0xac5c7493036de60e63eb81c5e9a440b42f47ebf5' as const

export const MOONSAMA_HEIGHT = 568970
export const PONDSAMA_HEIGHT = 1992976
export const PLOT_HEIGHT = 1241477
export const MOONX_HEIGHT = 664200
export const FACTORY_HEIGHT = 827439
export const ART_HEIGHT = 1027541
export const BOX_HEIGHT = 1402610
export const EMBASSY_HEIGHT = 1527496

// export const MOONSAMA_HEIGHT = process.env.MOONSAMA_HEIGHT || 568970;
// export const PONDSAMA_HEIGHT = process.env.PONDSAMA_HEIGHT || 1992976;
// export const PLOT_HEIGHT = process.env.PLOT_HEIGHT || 1241477;
// export const MOONX_HEIGHT = process.env.MOONX_HEIGHT || 664200;
// export const FACTORY_HEIGHT = process.env.FACTORY_HEIGHT || 827439;
// export const ART_HEIGHT = process.env.ART_HEIGHT || 1027541;
// export const BOX_HEIGHT = process.env.BOX_HEIGHT || 1402610;
// export const EMBASSY_HEIGHT = process.env.EMBASSY_HEIGHT || 1527496;

export const UPDATE_RATE = BigInt(process.env.UPDATE_RATE || 6 * 60 * 60 * 1000) // 6 hours
export const CONTRACT_API_BATCH_SIZE = 200
export const IPFS_API_BATCH_SIZE = 100
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const ERC721TOKEN_RELATIONS = {
    metadata: true,
    contract: true,
    owner: true,
}

export const ERC1155TOKEN_RELATIONS = {
    metadata: true,
    contract: true,
}
