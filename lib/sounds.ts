// Sound utilities for workout timer

export function playStartSound() {
  // Play the start.mp3 audio file when workout starts
  try {
    const audio = new Audio('/audios/start.mp3')
    audio.volume = 0.7 // Set a reasonable volume
    audio.play().catch(error => {
      console.warn('Could not play start sound:', error)
    })
  } catch (error) {
    console.warn('Could not create audio for start sound:', error)
  }
}

export function playCompleteSound() {
  // Play a success sound for workout completion
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.3)
}

export function playHalfwaySound() {
  // Play the half.mp3 audio file when exercise reaches halfway point
  try {
    const audio = new Audio('/audios/half.mp3')
    audio.volume = 0.7 // Set a reasonable volume
    audio.play().catch(error => {
      console.warn('Could not play halfway sound:', error)
    })
  } catch (error) {
    console.warn('Could not create audio for halfway sound:', error)
  }
}

export function playDoneSound() {
  // Play the done.mp3 audio file when exercise is completed
  try {
    const audio = new Audio('/audios/done.mp3')
    audio.volume = 0.7 // Set a reasonable volume
    audio.play().catch(error => {
      console.warn('Could not play done sound:', error)
    })
  } catch (error) {
    console.warn('Could not create audio for done sound:', error)
  }
}
