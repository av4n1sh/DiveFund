'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export const AMBIENT_AUDIO_SRC = '/audio/ambient-dive.mp3'
export const TARGET_AMBIENT_VOLUME = 0.08

interface AudioContextValue {
  isPlaying: boolean
  isMuted: boolean
  toggleAudio: () => void
  ensureStarted: () => void
}

const AudioSystemContext = createContext<AudioContextValue>({
  isPlaying: false,
  isMuted: true,
  toggleAudio: () => {},
  ensureStarted: () => {},
})

export function useAudioSystem() {
  return useContext(AudioSystemContext)
}

/**
 * AudioProvider:
 * Manages a hidden continuous HTMLAudioElement looping `/audio/ambient-dive.mp3`
 * (from `/public/audio/ambient-dive.mp3`) capped at `audio.volume = 0.08`.
 * Launches muted on the intro splash screen and safely unmutes + starts playback
 * on the user's first interaction event to comply with browser autoplay policies.
 */
export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const hasInteractedRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const ensureStarted = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = TARGET_AMBIENT_VOLUME

    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true
      audio.muted = false
      setIsMuted(false)
    }

    if (audio.paused) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
          })
          .catch(() => {
            // Silently ignore browser autoplay blocks until next gesture
          })
      }
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = TARGET_AMBIENT_VOLUME
      audio.muted = true
    }

    const handleFirstInteraction = () => {
      ensureStarted()
    }

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true, passive: true })
    window.addEventListener('click', handleFirstInteraction, { once: true, passive: true })
    window.addEventListener('keydown', handleFirstInteraction, { once: true, passive: true })

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [ensureStarted])

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = TARGET_AMBIENT_VOLUME
    hasInteractedRef.current = true

    if (audio.paused || audio.muted || isMuted) {
      audio.muted = false
      setIsMuted(false)
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {})
      }
    } else {
      audio.muted = true
      setIsMuted(true)
    }
  }, [isMuted])

  return (
    <AudioSystemContext.Provider
      value={{
        isPlaying,
        isMuted,
        toggleAudio,
        ensureStarted,
      }}
    >
      {/* Hidden continuous background audio element pointing to /public/audio/ambient-dive.mp3 */}
      <audio
        ref={audioRef}
        src={AMBIENT_AUDIO_SRC}
        loop
        preload="auto"
        muted
        playsInline
        className="hidden"
        aria-hidden="true"
      />
      {children}
    </AudioSystemContext.Provider>
  )
}

/**
 * Quiet line-art wave vector toggle widget button for the corner navigation grid.
 */
export function AudioToggle() {
  const { isPlaying, isMuted, toggleAudio } = useAudioSystem()
  const active = isPlaying && !isMuted

  return (
    <button
      type="button"
      onClick={toggleAudio}
      aria-label={active ? 'Mute ocean ambience' : 'Unmute ocean ambience'}
      title={active ? 'Mute ocean ambience' : 'Unmute ocean ambience'}
      className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-slate-800/80 bg-slate-900/75 px-3 text-xs font-medium text-slate-300 backdrop-blur-md transition-colors hover:border-sky-300/40 hover:text-white"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 text-sky-300"
        aria-hidden="true"
      >
        {active ? (
          <>
            <path d="M2 12h2" />
            <path d="M6 8v8" />
            <path d="M10 5v14" />
            <path d="M14 9v6" />
            <path d="M18 7v10" />
            <path d="M22 12h-2" />
          </>
        ) : (
          <>
            <path d="M2 12h20" strokeOpacity="0.45" />
            <path d="M8 10v4" strokeOpacity="0.45" />
            <path d="M12 9v6" strokeOpacity="0.45" />
            <path d="M16 10v4" strokeOpacity="0.45" />
          </>
        )}
      </svg>
      <span className="hidden font-mono text-[11px] tracking-wider uppercase sm:inline">
        {active ? 'Ambience' : 'Muted'}
      </span>
    </button>
  )
}
