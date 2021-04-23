import { createContext, useContext, useState } from 'react'

interface Episode {
  title:string
  members: string
  thumbnail: string
  duration: number
  url: string
}

interface PlayerContextData {
  episodeList: Episode[]
  currentEpisodeIndex: number
  hasNext: boolean
  hasPrevious: boolean
  isPlaying: boolean
  isLooping: boolean
  isShuffling: boolean
  play: (episode:Episode) => void
  togglePlay: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  playNext: () => void
  playPrevious: () => void
  setPlayingState: (state:boolean) => void
  playList: (list:Episode[], index:number) => void
  clearPlayerState: () => void
}

export const PlayerContext = createContext({} as PlayerContextData) 

export const PlayerContextProvider:React.FC = ({ children }) => {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const hasPrevious = currentEpisodeIndex > 0
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length  

  const play = (episode:Episode) => {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  const playList = (list:Episode[], index: number) => {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  const clearPlayerState = () => {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  const playNext = () => {
    if(!hasNext) return
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
      return
    }
    setCurrentEpisodeIndex(currentEpisodeIndex + 1)
  }

  const playPrevious = () => {
    if(!hasPrevious) return
    setCurrentEpisodeIndex(currentEpisodeIndex-1)
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping)
  }

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling)
  }

  const setPlayingState = (state:boolean) => {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        play, 
        togglePlay, 
        setPlayingState,
        playList,
        playNext,
        playPrevious,
        toggleLoop,
        isLooping,
        hasNext,
        hasPrevious,
        toggleShuffle,
        isShuffling,
        clearPlayerState
      }}>
    {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  const context = useContext(PlayerContext)

  if(!context) throw new Error('usePlayer must be inside a PLayerProvider')

  return context
}