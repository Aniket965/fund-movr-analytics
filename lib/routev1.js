export const constants = {
    bridges: {
      Hop: 'hop',
      AnySwap: 'anyswap',
      AnySwapRouterV4: 'anyswap-router-v4',
      PolygonBridge: 'polygon-bridge',
      ArbitrumBridge: 'arbitrum-bridge',
      Hyphen:'hyphen',
    },
    middleware: {
      OneInch: 'oneinch',
    },
    chains: {
      GOERLI_CHAIN_ID: 5,
      KOVAN_CHAIN_ID: 42,
      POLYGON_CHAIN_ID: 137,
      MUMBAI_CHAIN_ID: 80001,
      MAINNET_CHAIN_ID: 1,
      RINKEBY_CHAIN_ID: 4,
      ROPSTEN_CHAIN_ID: 3,
      ARBITRUM_TESTNET_CHAIN_ID: 421611,
      XDAI_CHAIN_ID: 100,
      SOKOL_CHAIN_ID : 77,
      ARBITRUM_CHAIN_ID: 42161,
      FANTOM_CHAIN_ID: 250,
      OPTIMISM_CHAIN_ID: 10,
    },
  }
export const routesV1 = {
    1: {
        bridgeIds: {
            [constants.bridges.Hop]: 1,
            [constants.bridges.PolygonBridge]: 2,
            [constants.bridges.ArbitrumBridge]: 3,
            [constants.bridges.AnySwapRouterV4]: 4,
            [constants.bridges.Hyphen]: 5,
      
        },
        middlewareIds: {
            [constants.middleware.OneInch]: 6,
        },
        bridgeNames: {
            1: constants.bridges.Hop,
            2: constants.bridges.PolygonBridge,
            3: constants.bridges.ArbitrumBridge,
            4: constants.bridges.AnySwapRouterV4,
            5: constants.bridges.Hyphen,
       
        },
        middlewareNames: {
            6: constants.middleware.OneInch,
        }
      },
    56: {
        bridgeIds: {
            [constants.bridges.AnySwapRouterV4]: 1
        },
        middlewareIds: {
            [constants.middleware.OneInch]: 2,
        },
        bridgeNames: {
            1: constants.bridges.AnySwapRouterV4,
        },
        middlewareNames: {
            2: constants.middleware.OneInch,
        }
    },
    100: {
        bridgeIds: {
            [constants.bridges.Hop]: 1,
        },
        bridgeNames: {
            1: constants.bridges.Hop,
        },
    },
    42: {
        bridgeIds: {
            [constants.bridges.Hop]: 1,
        },
        bridgeNames: {
            1: constants.bridges.Hop,
        },
    },
    5: {
        bridgeIds: {
            [constants.bridges.Hop]: 1,
            [constants.bridges.PolygonBridge]: 2
        },
        bridgeNames: {
            1: constants.bridges.Hop,
            2: constants.bridges.PolygonBridge,
        },
    },
    80001: {
        bridgeIds: {
            [constants.bridges.Hop]: 1,
            [constants.bridges.Hyphen]: 2
        },
        bridgeNames: {
            1: constants.bridges.Hop,
            2: constants.bridges.Hyphen,
        },
    },
    137: {
        bridgeIds: {
            [constants.bridges.Hop]: 1,
            [constants.bridges.AnySwapRouterV4]: 2,
            [constants.bridges.Hyphen]: 3
        },
        bridgeNames: {
            1: constants.bridges.Hop,
            2: constants.bridges.AnySwapRouterV4,
            3: constants.bridges.Hyphen
        },
        middlewareIds: {
            [constants.middleware.OneInch]: 4,
        },
        middlewareNames: {
            4: constants.middleware.OneInch,
        },
    },
    4: {
        bridgeIds: {
            [constants.bridges.ArbitrumBridge]: 1,
        },
        bridgeNames: {
            1: constants.bridges.ArbitrumBridge,
        },
    },
    250: {
        bridgeIds: {
            [constants.bridges.AnySwapRouterV4]: 1
        },
        bridgeNames: {
            1: constants.bridges.AnySwapRouterV4,
        },
    },
    43114: {
        bridgeIds: {
            [constants.bridges.AnySwapRouterV4]: 1
        },
        bridgeNames: {
            1: constants.bridges.AnySwapRouterV4,
        },
    },
    42161: {
        bridgeIds: {
            [constants.bridges.Hop]: 2
        },
        middlewareIds: {
            [constants.middleware.OneInch]: 1,
        },
        bridgeNames: {
            2: constants.bridges.Hop,
        },
        middlewareNames: {
            1: constants.middleware.OneInch,
        }
    },

}