import React from 'react'
import {assets} from '../assets/assets'

function Sidebar() {
  return (
    <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
        <div className='bg-[#121212] h-[15%] rounded flex flex-col justify-around'>
            <div className='flex item-center gap-3 pl-8 cursor-pointer'>
                    <img className='w-6' src={assets.home_icon} alt=''/>
                    <p className='font-bold'>Home</p>
                </div>
                <div className='flex item-center gap-3 pl-8 cursor-pointer'>
                    <img className='w-6' src={assets.search_icon} alt=''/>
                    <p className='font-bold'>Search</p>
                </div>
            </div>
        <div/>
        <div className='bg-[#121212] h-[85%] rounded'>
            <div  className='flex item-center p-4 justify-between'>
                <div className='flex item-center gap-3 pl-5'>
                    <img className='w-6' src={assets.stack_icon} alt=''/>
                    <p className='font-bold'>Your Library</p>
                </div>
                <div className='flex item-center gap-3 pl-5'>
                    <img className='w-5' src={assets.arrow_icon} alt=''/>
                    <img className='w-5' src={assets.plus_icon} alt=''/>
                </div>
            </div>
            <div className='p-4 m-2 bg-[#242424] rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
                <h1>Make your own Playlists</h1>
                <p className='font-light'>Start by adding your favorite songs</p>
                <button className='bg-white text-[15px] text-black px-4 py-1.5 rounded-full mt-4'>New Playlist</button>
            </div>
            <div className='p-4 m-2 bg-[#242424] rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
                <h1>Add Favourite Song</h1>
                <p className='font-light'>Start by adding your favorite songs</p>
                <button className='bg-white text-[15px] text-black px-4 py-1.5 rounded-full mt-4'>New Playlist</button>
            </div>
        </div>
    </div>
  )
}

export default Sidebar