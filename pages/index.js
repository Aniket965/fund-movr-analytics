import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ethers from 'ethers'
import styles from '../styles/Home.module.css'
import { handleData } from '../lib'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

export default function Home() {
  const [data,setData] = useState(null);
  useEffect(() => {
    handleData().then(data => setData(data))
  }, [])
  return <div>
    <div className='text-black' >
 <div className='text-gray-400 text-yellow-400 text-blue-400 border-blue-400 text-purple-400 text-green-400 border-green-400 border-yellow-400 border-purple-400 border-gray-400' ></div>
    {data ? <div>
      
      <div className='text-5xl font-bold text-green-500 text-center my-12' > 🚀 🚀 🚀  Fund Movr Stats</div>
      <div className='text-8xl font-bold text-center pt-12' >
          {formatter.format(data.totalAmount.toNumber())}
    
      </div>
      <div className='text-3xl text-gray-400 font-bold text-center pb-12' >
         Total Traded Volume
      </div>
      <div className='text-8xl font-bold text-center pt-12' >
      {formatter.format(data.totalAmountLeft.toNumber())}
    
      </div>
      <div className='text-3xl text-gray-400 font-bold text-center pb-12' >
         Left For the 🕺  Big Day 
      </div>
      <div className='flex gap-4 w-full justify-center' >  
       {Object.keys(data['stats']).map(chain => <div className={`border-8 rounded-3xl p-4 w-fit border-${data['stats'][chain]['color']}`}  key={chain}>
        <div className={`font-bold text-3xl pt-8 text-${data['stats'][chain]['color']} text-center`} >{chain}</div>
      
        <div className='font-bold text-2xl text-center my-2'  >
      {formatter.format(data['stats'][chain].totalAmountInUsd.toNumber())}
      </div>
      <div> 
       <strong> Total txs:</strong> {data['stats'][chain].txs.length}

      </div>
      <div>
       <strong> BridgeWise Txs:</strong> 
       <ol className='ml-4' >
        {Object.keys(data['stats'][chain].bridgeWiseTxs).map(key => <li key={key}> <strong> {key}</strong>: {data['stats'][chain].bridgeWiseTxs[key].length}  </li>)}
        </ol>
       </div> 
       <div>
       <strong> Middleware Txs:</strong> 
       <ol className='ml-4' >
        {Object.keys(data['stats'][chain].middlewareTxs).map(key => <li key={key}> <strong> {key}</strong>: {data['stats'][chain].middlewareTxs[key].length}  </li>)}
        </ol>
       </div> 
       </div> )}
      </div> </div> : null}
    </div>
    
  </div>
}
