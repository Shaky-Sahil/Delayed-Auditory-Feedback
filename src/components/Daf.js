import React, { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { BeakerIcon, MicrophoneIcon } from '@heroicons/react/24/solid'
const Daf = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mic, setMic] = useState(null);
  const [delay, setDelay] = useState(0.15); // Initial delay value
  const [micPermission, setMicPermission] = useState(false);

  const handlePermissions = ()=>{
    navigator.mediaDevices.getUserMedia(
      {
        audio: true,
      },
    ).then(()=>{
      console.log("Microphone Permissions Acquired")
      setMicPermission(true);
    })
    .catch(()=>{
      console.error("Microphone Permissions not granted")
    })
  }

  useEffect(()=>{
    handlePermissions();
  });

  const startRecording = async () => {
    try {
      await Tone.start(); // Start the audio context

      // Create a Tone.Delay node for the delay effect
      const delayNode = new Tone.Delay(delay).toDestination();

      // Create a UserMedia instance for microphone input
      const micInstance = new Tone.UserMedia();

      // Connect the microphone input to the delay effect
      micInstance.connect(delayNode);

      // Start the microphone
      await micInstance.open();

      // Update state
      setIsRecording(true);
      setMic(micInstance);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mic) {
      mic.close();
      setIsRecording(false);
    }
  };

  // Function to handle delay change
  const handleDelayChange = (e) => {
    const newDelay = parseFloat(e.target.value);
    setDelay(newDelay);

    // If recording is active, update the delay time of the delayNode
    if (isRecording && mic) {
      mic.disconnect(); // Disconnect the mic from the previous delayNode
      const newDelayNode = new Tone.Delay(newDelay).toDestination(); // Create a new delayNode with updated delay time
      mic.connect(newDelayNode); // Connect the mic to the new delayNode
    }
  };

  return (
    <div className='bg-[#8f8e90] text-white w-full h-screen'>
      <div className='text-center'>
        <h1 className='text-center pt-10 pb-10 font-bold underline'>Delayed Auditory FeedBack</h1>
        

        <div className='flex justify-center'>
        <button className=' flex' onClick={()=>{
        if(micPermission){
          isRecording ? stopRecording() : startRecording()
        }
        else{
          handlePermissions()
        }
        }
        }>
        {isRecording ? <button className='text-center p-3 bg-slate-400 mt-4 mb-4 rounded-xl text-white'><div className='flex items-center text-center'><MicrophoneIcon className='w-5 h-5 mr-3'/> Stop recording</div></button> : <button className='text-center p-3 bg-slate-600 mt-4 mb-4 rounded-xl text-white'><div className='flex items-center text-center'><MicrophoneIcon className='w-5 h-5 mr-3'/> Start recording</div></button>}
        </button>
        </div>


        <label className='flex items-center justify-center'>
        <p className='mr-3'>50Ms</p>
        <input
          type="range"
          min={0.05}
          max={0.5}
          step={0.01}
          value={delay}
          onChange={handleDelayChange}
        />
        <p className='ml-3'>500Ms</p>
      </label>
      <br />
      <output>Current delay is: {delay * 1000}Ms</output>
      </div>
    </div>
  );
};

export default Daf;
