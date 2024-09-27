import React from 'react'
import { assets, songsData } from '../assets/assets'

function Player() {
  return (
    <div className='h-[10%] bg-black flex justify-between items-center text-white px-4'>
        <div className='hidden lg:flex items-center gap-4'>
            <img className='w-12' src={songsData[0].image} alt=''/>
            <div>
                <p className='font-bold'>{songsData[0].name}</p>
                <p>{songsData[0].artist}</p>
            </div>
        </div>
        <div className='flex flex-col items-center gap-1 m-auto'>
            <div className='flex gap-5'>
                <img className='w-4 cursor-pointer' src={assets.shuffle_icon} alt=''/>
                <img className='w-4 cursor-pointer' src={assets.prev_icon} alt=''/>
                <img className='w-4 cursor-pointer' src={assets.play_icon} alt=''/>
                <img className='w-4 cursor-pointer' src={assets.next_icon} alt=''/>
                <img className='w-4 cursor-pointer' src={assets.loop_icon} alt=''/>
            </div>
            <div className='flex items-center gap-4'>
                <p>1:04</p>
                <div className='w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer'>
                    <div className='h-1 border-none w-0 bg-green-200 rouded-full'></div>
                </div>
                <p>3:45</p>
            </div>
        </div>
        <div className='hidden lg:flex items-center gap-4 opacity-75'>
            <img className='w-4 cursor-pointer' src={assets.plays_icon} alt=''/>
            <img className='w-4 cursor-pointer' src={assets.mic_icon} alt=''/>
            <img className='w-4 cursor-pointer' src={assets.queue_icon} alt=''/>
            <img className='w-4 cursor-pointer' src={assets.speaker_icon} alt=''/>
            <img className='w-4 cursor-pointer' src={assets.volume_icon} alt=''/>
            <div className='w-20 h-1 rounded bg-slate-50'></div>
            <img className='w-4 cursor-pointer' src={assets.mini_player_icon} alt=''/>
            <img className='w-4 cursor-pointer' src={assets.zoom_icon} alt=''/>
        </div>
    </div> 
  )
}

export default Player