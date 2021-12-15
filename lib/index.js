import { BigNumber, ethers } from "ethers";
import registryV0Abi from '../assets/registryV0.json';
import {routes} from '@movr/fund-movr-core'
import {createfetchUnlessCached} from "fetch-unless-cached"

const cachedFetch = createfetchUnlessCached(500)

const V0RegistryDecoder = new ethers.utils.Interface(registryV0Abi);


export const handleData = async () => {
  const ethereumData = await handleEthereumV0();
  const polygonData = await handlePolygonV0();
  const binanceData = await handleBinanceV0();
  // const xdaiData = await handleXdaiV0();
  const totaldata = mergeData([ethereumData,polygonData,binanceData]);
  const data = {
    'totalAmount': totaldata.totalAmountInUsd,
    'totalAmountLeft': ethers.BigNumber.from('10000000').sub(totaldata.totalAmountInUsd),
    'stats': {
      'Total': totaldata,
      'Mainnet ': ethereumData,
      'Polygon': polygonData,
      'Binance': binanceData,
      // 'XDai': xdaiData,
    }


  }
  return data;
}

export const mergeData = (chainsData) => {
  let txs = [];
  const bridgeWiseTxs = {};
  const middlewareTxs = {};
  const chainId = 0;
  let totalAmount = BigNumber.from(0);
  chainsData.map(chainData => {
    txs = txs.concat(chainData.txs)
    Object.keys(chainData.bridgeWiseTxs).map(bridgeName => {
      if(!bridgeWiseTxs[bridgeName])bridgeWiseTxs[bridgeName] = []
      bridgeWiseTxs[bridgeName] = bridgeWiseTxs[bridgeName].concat(chainData.bridgeWiseTxs[bridgeName])
    }) 

    totalAmount = totalAmount.add(chainData.totalAmountInUsd)

    Object.keys(chainData.middlewareTxs).map(middlewareName => {
      if(!middlewareTxs[middlewareName])middlewareTxs[middlewareName] = []
      middlewareTxs[middlewareName] = middlewareTxs[middlewareName].concat(chainData.middlewareTxs[middlewareName])
    }) 
  })
  return {
    chainId,
    txs,
    bridgeWiseTxs: bridgeWiseTxs,
    middlewareTxs: middlewareTxs,
    totalAmountInUsd: totalAmount,
    color: 'black'
  }
}

export const handleXdaiV0 = async () => {
  const registryAddress = "0xaD8D3C555c2abc9713Cb5d2ff03b59343ff4c4Ad";
  const chainId = 100;
  const data = await fetch(
    `https://blockscout.com/xdai/mainnet/api?module=account&action=txlist&address=${registryAddress}`, { mode: 'no-cors'}
  );
  let transactions = [];
  if (data.status === "1") {
    transactions = data.result.reduce((txs, tx) => {
      try {
        const hash = tx.has;
        const input = tx.input;
        txs.push({
          hash,
          input,
          chainId,
        });
      } catch (err) {
        console.log(err);
      }
      return txs;
    }, []);
  }
  const chainStats = await getChainStatsV0(transactions, 100, 'green-400');
  return chainStats;
}
export const handleBinanceV0 = async () => {
  const registryAddress = "0x0b6a733c770ada091bff20d60a569e96ad695d2f";
  const chainId = 56;
  const data = await cachedFetch(
    `https://api.bscscan.com/api?module=account&action=txlist&address=${registryAddress}&sort=asc&apikey=YourApiKeyToken`
  );
  let transactions = [];
  if (data.status === "1") {
    transactions = data.result.reduce((txs, tx) => {
      try {
        const hash = tx.has;
        const input = tx.input;
        txs.push({
          hash,
          input,
          chainId,
        });
      } catch (err) {
        console.log(err);
      }
      return txs;
    }, []);
  }
  const chainStats = await getChainStatsV0(transactions, 56, 'yellow-400');
  return chainStats;
}
export const handlePolygonV0 = async () => {
    const registryAddress = "0xca09f09e0f7b93f19e5a29fbe0486606ff32bb4e";
    const chainId = 137;
    const data = await cachedFetch(
      `https://api.polygonscan.com/api?module=account&action=txlist&address=${registryAddress}&sort=asc&apikey=YourApiKeyToken`
    );
    let transactions = [];
    if (data.status === "1") {
      transactions = data.result.reduce((txs, tx) => {
        try {
          const hash = tx.has;
          const input = tx.input;
          txs.push({
            hash,
            input,
            chainId,
          });
        } catch (err) {
          console.log(err);
        }
        return txs;
      }, []);
    }
    const chainStats = await getChainStatsV0(transactions, 137,'purple-400');
    return chainStats;
}

export const handleEthereumV0 = async () => {
  const registryAddress = "0x6d290609b3f5f02d52f28d97c75a443ed8564cbf";
  const chainId = 1;
  const data = await cachedFetch(
    `https://api.etherscan.com/api?module=account&action=txlist&address=${registryAddress}&sort=asc&apikey=YourApiKeyToken`
  );
  let transactions = [];
  if (data.status === "1") {
    transactions = data.result.reduce((txs, tx) => {
      try {
        const hash = tx.has;
        const input = tx.input;
        txs.push({
          hash,
          input,
          chainId,
        });
      } catch (err) {
        console.log(err);
      }
      return txs;
    }, []);
  }
  const chainStats = await getChainStatsV0(transactions, 1, 'gray-400');
  return chainStats;
}

export const getBridgeNameFromBridgeId = (bridgeId,chainId) => {
  return routes[chainId].bridgeNames[bridgeId]
}

export const getMiddlewareNameFromMiddlewareId = (middlewareId,chainId) => {
  if(middlewareId === 0) return 'no-middleware';
  return routes[chainId].middlewareNames[middlewareId]
}

export const getTokenPrice = async (tokenAddress, chainId) => {
  const _tokenAddress = tokenAddress.toLowerCase();
  const data = await cachedFetch(
    `https://api.fund.movr.network/v1/token-price?tokenAddress=${_tokenAddress}&chainId=${chainId}`
  );
  return data.result;
}

export const getTokenUSDValue = async (tokenAddress, chainId, amount) => {
    const tokenPriceData = await getTokenPrice(tokenAddress,chainId);
    const _amt = (ethers.BigNumber.from(amount).div(
      ethers.BigNumber.from(10).pow(tokenPriceData.decimals)
    ).toNumber() * tokenPriceData.tokenPrice)  
    return ethers.BigNumber.from(Math.floor(_amt));
}
export const getChainStatsV0 = async (transactions,chainId,color) => {
    const totalAmountInUsd = BigNumber.from(0);
    const txs = [];
    const bridgeWiseTxs = {}
    const middlewareTxs = {}
    await Promise.all(transactions.map(async (tx) => {
            try {
                const input = tx.input;
                const txHash = tx.hash;
                const decodedData = V0RegistryDecoder.decodeFunctionData('outboundTransferTo', input)[0];
                const amount = ethers.BigNumber.from(decodedData.amount);
                const middlewareInputToken = decodedData.middlewareInputToken;
                const bridgeInputToken = decodedData.tokenToBridge;
                const middlewareId = ethers.BigNumber.from(decodedData.middlewareID).toNumber();
                const bridgeId = ethers.BigNumber.from(decodedData.bridgeID).toNumber();
                let tokenAddress = middlewareInputToken;
                if(middlewareId === 0) tokenAddress = bridgeInputToken;
                const usdValue = await getTokenUSDValue(tokenAddress,chainId, amount);
                const bridgeName = getBridgeNameFromBridgeId(bridgeId, chainId);
                const middlewareName = getMiddlewareNameFromMiddlewareId(middlewareId, chainId)
                const _tx = {
                  hash:txHash,
                  amount,
                  tokenAddress,
                  usdValue,
                  bridgeName,
                  middlewareName,
                }
                txs.push(_tx);

                if(!bridgeWiseTxs[bridgeName]) bridgeWiseTxs[bridgeName] = []
                bridgeWiseTxs[bridgeName].push(_tx)

                if(!middlewareTxs[middlewareName]) middlewareTxs[middlewareName] = []
                middlewareTxs[middlewareName].push(_tx)
                totalAmountInUsd = totalAmountInUsd.add(usdValue);
            }catch(err) {
                console.log(err)
            } 
          
    }))
    return {
      chainId,
      txs,
      bridgeWiseTxs,
      middlewareTxs,
      totalAmountInUsd,
      color
    }
}
