import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo, FaVolumeUp } from 'react-icons/fa';
import { Link ,useNavigate} from 'react-router-dom';
import { assets } from '../../assets/assets';
import { albumsData } from '../../assets/assets';


const DreamStreamer = ({ signOut }) => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [volume, setVolume] = useState(1); // Volume (0.0 - 1.0)
  const [progress, setProgress] = useState(0); // Track progress (0 - 100)
  const [shuffle, setShuffle] = useState(false); // Shuffle mode
  const [repeat, setRepeat] = useState(false); // Repeat mode
  const [purchasedAlbums, setPurchasedAlbums] = useState([]);
  const navigate = useNavigate(); // Hook for navigation


  
  // Fetch all albums on load
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get('https://0jxojmo6mj.execute-api.ap-south-1.amazonaws.com/Development/albums');
        setAlbums(response.data.albums);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();

    // Retrieve purchased albums from localStorage
    const storedPurchasedAlbums = localStorage.getItem('purchasedAlbums');
    if (storedPurchasedAlbums) {
      setPurchasedAlbums(JSON.parse(storedPurchasedAlbums));
    }
  }, []);

  // Function to handle purchasing an album
const handlePurchase = (album) => {
  // Check if the album is already purchased
  const isPurchased = purchasedAlbums.some(purchasedAlbum => purchasedAlbum.albumId === album.albumId);

  if (isPurchased) {
    alert(`You have already purchased ${album.albumName}!`);
    return; // Exit the function if already purchased
  }

  // If not purchased, proceed with the purchase
  alert(`You have purchased ${album.albumName}!`);

  // Simulate a purchase by adding the album to purchased albums
  const newPurchasedAlbums = [...purchasedAlbums, album];
  setPurchasedAlbums(newPurchasedAlbums);

  // Store purchased albums in localStorage for persistence
  localStorage.setItem('purchasedAlbums', JSON.stringify(newPurchasedAlbums));
};

  // Function to view purchased albums (navigates to a different page)
  const viewPurchasedAlbums = () => {
    if (purchasedAlbums.length === 0) {
      alert("You haven't purchased any albums.");
      navigate('/'); // Redirect to the home page
      return;
    }

    // For simplicity, you can navigate to a different view here
    // Or simply set a flag to display purchased albums
    setAlbums(purchasedAlbums);
    setSelectedAlbum(null); // Clear any selected album
  };

  const playTrack = async (trackUrl, index, albumId, trackName) => {
    if (audio) {
      audio.pause();
    }
  
    const newAudio = new Audio(trackUrl);
    newAudio.volume = volume; // Set the initial volume
    newAudio.play();
    setAudio(newAudio);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  
    // Update progress
    newAudio.addEventListener('timeupdate', () => {
      setProgress((newAudio.currentTime / newAudio.duration) * 100);
    });
  
    // Track ended handling
    newAudio.addEventListener('ended', () => {
      if (repeat) {
        playTrack(trackUrl, index, albumId, trackName); // Replay the current track
      } else if (shuffle) {
        playRandomTrack();
      } else {
        playNextTrack(); // Go to the next track
      }
    });
  
    // Call API to update play count
    try {
      await axios.post('https://0jxojmo6mj.execute-api.ap-south-1.amazonaws.com/Development/track-played-count', {
        albumId,
        trackName,
      });
      console.log('Track play recorded successfully');
    } catch (error) {
      console.error('Error recording track play:', error);
    }
  };
  

  // Function to toggle play/pause
  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Play the next track
  const playNextTrack = () => {
    if (selectedAlbum) {
      if (shuffle) {
        playRandomTrack();
      } else if (currentTrackIndex < selectedAlbum.tracks.length - 1) {
        playTrack(selectedAlbum.tracks[currentTrackIndex + 1].trackUrl, currentTrackIndex + 1);
      } else {
        setIsPlaying(false); // Stop playing when the last track finishes
      }
    }
  };

  // Play the previous track
  const playPreviousTrack = () => {
    if (selectedAlbum && currentTrackIndex > 0) {
      playTrack(selectedAlbum.tracks[currentTrackIndex - 1].trackUrl, currentTrackIndex - 1);
    }
  };

  // Play a random track for shuffle mode
  const playRandomTrack = () => {
    if (selectedAlbum) {
      const randomIndex = Math.floor(Math.random() * selectedAlbum.tracks.length);
      playTrack(selectedAlbum.tracks[randomIndex].trackUrl, randomIndex);
    }
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100;
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  // Track progress control
  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    setProgress(newProgress);
    if (audio) {
      audio.currentTime = (newProgress / 100) * audio.duration;
    }
  };

  // Toggle shuffle mode
  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  // Toggle repeat mode
  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  // Select an album and show its tracks
  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setCurrentTrackIndex(0); // Reset to the first track when an album is selected
  };

  if (!albums.length) return <p>Loading albums...</p>;

  const AlbumItem = ({image,desc,id}) => {
  <div className='min-w-[180px] p-2 px-3 rounded cursor-ponter'>
    <img className='rounded' src={Image} alt=''/>
    <p className='text-sm'>{desc}</p>
  </div> 
  };



  return (
    <div className=" flex flex-col bg-black h-full">
      {/* Header */}
      
        {/* <div className=' flex justify-between items-center font-semibold'>

        <header className="flex items-center justify-between p-4 bg-gray-800">
       <Link to="/"><h1 className="text-2xl font-bold">DreamStreamer</h1></Link>

       <div className='flex items-center gap-2'>
                <img className='w-8 bg-black p-2 rounded-2xl cursor-pointer'  alt=''/>
                <img className='w-8 bg-black p-2 rounded-2xl cursor-pointer'  alt=''/>
       </div>

       <div className='flex items-center gap-4'>
                <p className='bg-white text-black text-[15px] px-4 py-1rounded-2xl hidden md:block'>Explore Premium</p>
                <p className='bg-black text-[15px] px-3 py-1 rounded-2xl'>Install App</p>
            </div>

       <button
          onClick={viewPurchasedAlbums}
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 ml-4"
        >
          View Purchased Albums
        </button>
         
      <button
          onClick={signOut}
          className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
        >
          Sign Out
        </button>

        <button
          onClick={signOut}
          className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
        >
          Sign Out
        </button>

        </header>


        </div> */}

    <header>
    <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-black top-0 ">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="" class="flex items-center">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcZCmcbOkIV2QVv8jbaYk01hIM9CLd6Hyb2g&usqp=CAU" class="mr-3 h-6 sm:h-9 rounded-lg" alt="Flowbite Logo" />
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-purple-500">DreamStreamer</span>
            </a>
            <div class="flex items-center lg:order-2">
            <a href="#" class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">Explore Premium</a>
                <button onClick={viewPurchasedAlbums} className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'>View Purchased Albums</button>
                <button onClick={signOut} className='text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800'>Sign Out</button>
                
                <button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                    <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
            <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
            </div>
        </div>
    </nav>
    </header>

      {/* Main Content */}

      <div className='flex flex-grow w-full h-full overflow-y-auto'>
        {/* Sidebar - Album List */}
        {/* <aside className="w-1/4 bg-gray-800 p-4">
          <h2 className="text-lg font-bold mb-4">Albums</h2>
          <ul className="space-y-4">
            {albums.map((album) => (
              <li key={album.albumId} className="cursor-pointer">
                <img
                  src={album.albumArtUrl}
                  alt={album.albumName}
                  className="w-40 h-40 rounded-lg hover:opacity-80 transition duration-200"
                  onClick={() => handleAlbumClick(album)}
                />
                <p className="text-center mt-2">{album.albumName}</p>
                <button
                  onClick={() => handlePurchase(album)}
                  className="mt-2 py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 w-full"
                >
                  Purchase
                </button>
              </li>
            ))}
          </ul>
        </aside> */}

      <div className='w-[25%]h-full flex-col p-2 gap-2 text-white hidden lg:flex'>
        <div className='bg-[#121212] h-[25%] flex flex-col rounded justify-around'>
            <div className='flex item-center gap-5 pl-8 cursor-pointer'>
                    <img className='w-6' src={assets.home_icon} alt=''/>
                    <p className='font-bold'>Home</p>
                </div>
                <div className='flex item-center gap-5 pl-8 cursor-pointer'>
                    <img className='w-6' src={assets.search_icon} alt=''/>
                    <p className='font-bold'>Search</p>
                </div>
                <div className='flex item-center gap-5 pl-8 cursor-pointer'>
                    <img className='w-5' src={assets.plus_icon} alt=''/>  
                    <p className='font-bold'>Create Playlist</p>
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
            <div  className='flex item-center p-4 justify-between'>
                <div className='flex item-center gap-3 pl-5'>
                    <img className='w-6' src={assets.like_icon} alt=''/>
                    <p className='font-bold'>Liked Songs</p>
                </div>
                <div className='flex item-center gap-3 pl-5'>
                    <img className='w-5' src={assets.arrow_icon} alt=''/>
                    <img className='w-5' src={assets.plus_icon} alt=''/>
                </div>
            </div>
            {/* <ul className="space-y-4">
            {albums.map((album) => (
              <li key={album.albumId} className="min-w-[180px] p-2 px-3 rounded cursor-pointer">
                <img
                  src={album.albumArtUrl}
                  alt={album.albumName}
                  className="w-40 h-40 p-2 rounded hover:opacity-80 transition duration-200"
                  onClick={() => handleAlbumClick(album)}
                />
                <p className="font-bold mt-2 mb-1">{album.albumName}</p>
                <button
                  onClick={() => handlePurchase(album)}
                  className="mt-2 py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200 w-full"
                >
                  Purchase
                </button>
              </li>
            ))}
          </ul> */}
        
          
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

        {/* Main Content Area - Show Tracks after an Album is Selected */}
      <div className='w-full h-full bg-[#121212] text-white px-5 overflow-y-auto rounded lg:w-[75%] lg:ml-0 max-w-screen-xl'>
        <div className='flex items-center gap-3 mt-4'>
          <p className='text-white font-semibold px-4 py-1 rounded-2xl cursor-pointer'>Music</p>
          <p className='bg-white text-black font-semibold px-4 py-1 rounded-2xl cursor-pointer'>Albums</p>
          <p className='text-white font-semibold px-4 py-1 rounded-2xl cursor-pointer'>Podcast</p>
        </div>


        <div className='mb-4'>
          <h2 className=' my-5 font-bold text-2xl p-4'>Hit charts</h2>
          <div className='flex overflow-auto'>
            {albumsData.map((item,index) => (
            <div className='key={index} min-w-[180px] p-2 px-3 rounded-lg cursor-pointer hover:bg-[#ffffff26]'>
                <img
                  src={item.image}
                  alt={item.desc}
                  className="w-40 h-40 p-2 rounded-lg hover:opacity-80 transition duration-200"
                />
            </div>
            ))}
          </div>
        </div>
        <div className='mb-4'>
            <h2 className=' my-5 font-bold text-2xl p-4'>featured charts</h2>
            <div className='flex overflow-auto'>
            {albums.map((album) => (
            <div className='key={album.albumId} min-w-[180px] p-2 px-3 rounded-lg cursor-pointer hover:bg-[#ffffff26]'>
                <img
                  src={album.albumArtUrl}
                  alt={album.albumName}
                  className="w-40 h-40 p-2 rounded-lg hover:opacity-80 transition duration-200"
                  onClick={() => handleAlbumClick(album)}
                />
                <p className="font-bold mt-2 mb-1">{album.albumName}</p>
            </div>
            ))}
            

          </div>
      </div>

        <main className="flex-grow p-6">
          {selectedAlbum ? (
            <>
              {/* Album Info */}
              <section className="mb-8">
                <div className="flex items-center space-x-10">
                  <img
                    src={selectedAlbum.albumArtUrl}
                    alt="Album Art"
                    className="w-40 h-40 rounded-lg mr-6"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{selectedAlbum.albumName}</h2>
                    <p className="text-gray-400">Artists: {selectedAlbum.artists.join(', ')}</p>
                    <p className="text-gray-400">Band Composition: {selectedAlbum.bandComposition}</p>
                    <p className="text-gray-400">Album Year: {selectedAlbum.albumYear}</p>
                  </div>

                  <button
                  onClick={() => handlePurchase(albums)}
                  className="mt-2 py-1 px-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                >
                  Purchase
                </button>
                </div>

                <div>
                <h3 className="text-lg font-bold mb-4">Tracks</h3>
                <ul className="space-y-2">
                {selectedAlbum.tracks.map((track, index) => (
                  <li
                    key={index}
                    className={`bg-violet-950 p-3 rounded-lg hover:bg-violet-900 transition duration-200 cursor-pointer ${index === currentTrackIndex ? 'bg-gray-700' : ''}`}
                    onClick={() => playTrack(track.trackUrl, index, selectedAlbum.albumId, track.trackName)}
                  >
                    <p className="font-semibold">{track.trackName}</p>
                    <p className="text-gray-400">Label: {track.trackLabel}</p>
                  </li>
                ))}
              </ul>

              </div>
              </section>

              {/* Track List */}

            </>
          ) : (
            <p>Please select an album to view the tracks.</p>
          )}
        </main>
      </div>
    </div>
    

      {/* Music Player */}
      {selectedAlbum && (
        <footer className="bg-black p-4 fixed bottom-0 w-full">
          <div className="flex items-center justify-between">
            {/* Album Art and Track Info */}
            <div className="flex items-center">
              <img
                src={selectedAlbum.albumArtUrl}
                alt="Album Art"
                className="w-12 h-12 rounded-lg mr-4"
              />
              <div>
                <p className="text-sm text-white font-semibold">{selectedAlbum.tracks[currentTrackIndex].trackName}</p>
                <p className="text-xs text-gray-400">Artists: {selectedAlbum.artists.join(', ')}</p>
              </div>
            </div>

            {/* Player Controls */}
            {/* <div className="flex items-center space-x-4">
              <button
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-200"
                onClick={playPreviousTrack}
              >
                <FaStepBackward className="text-white" />
              </button>
              <button
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-200"
                onClick={togglePlayPause}
              >
                {isPlaying ? <FaPause className="text-white" /> : <FaPlay className="text-white" />}
              </button>
              <button
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-200"
                onClick={playNextTrack}
              >
                <FaStepForward className="text-white" />
              </button>
            </div> */}
            <div className='flex flex-col items-center gap-1 m-auto'>
            <div className='flex gap-5'>
                <img className='w-4 cursor-pointer hover:bg-gray-900 transition duration-200' src={shuffle ? assets.shuffle_icon : assets.shuffle_icon} alt='' onClick={toggleShuffle}/>
                <img className='w-4 cursor-pointer transition duration-200' src={assets.prev_icon} alt='' onClick={playPreviousTrack}/>
                <img className='w-4 cursor-pointer transition duration-200' src={isPlaying ?  assets.pause_icon : assets.play_icon } alt='' onClick={togglePlayPause} />
                <img className='w-4 cursor-pointer transition duration-200' src={assets.next_icon} alt='' onClick={playNextTrack}/>
                <img className='w-4 cursor-pointer hover:bg-gray-900 transition duration-200' src={repeat ? assets.loop_icon : assets.loop_icon} alt='' onClick={toggleRepeat}/>
            </div>
            <div className='flex items-center gap-4'>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={handleProgressChange}
                      className="w-[60vw] max-w-[500px]"
                    />
            </div>
        </div>

            {/* Volume Control */}
            {/* <div className="flex items-center space-x-2">
              <FaVolumeUp className="text-white" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div> */}

            {/* Track Progress Slider */}
            {/* <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-64"
              />
            </div> */}

            {/* Shuffle and Repeat Controls */}
            <div className="flex items-center space-x-4">
              {/* <button
                className={`p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-200 ${shuffle ? 'bg-blue-500' : ''}`}
                onClick={toggleShuffle}
              >
                <FaRandom className="text-white" />
              </button>
              <button
                className={`p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition duration-200 ${repeat ? 'bg-blue-500' : ''}`}
                onClick={toggleRepeat}
              >
                <FaRedo className="text-white" />
              </button> */}
          <div className='hidden lg:flex items-center gap-4 opacity-75'>
            <img className='w-4 cursor-pointer' src={assets.plays_icon} alt=''/>
            <img className='w-4 cursor-pointer' src={assets.mic_icon} alt=''/>
            <img className='w-4 cursor-pointer' src={assets.queue_icon} alt=''/>
            <img className='w-4 cursor-pointer' src={assets.speaker_icon} alt=''/>
            <img className='w-4 cursor-pointer' src={assets.volume_icon} alt=''/>
            <div className='w-15 h-5 rounded '>
            <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={handleVolumeChange}
              />
            </div>
          </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default DreamStreamer;
