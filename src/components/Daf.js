

import React, { useState } from 'react';
import * as Tone from 'tone';

const Daf = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mic, setMic] = useState(null);

  const startRecording = async () => {
    try {
      await Tone.start(); // Start the audio context

      // Create a Tone.Delay node for the delay effect
      const delay = new Tone.Delay(0.05).toDestination();

      // Create a UserMedia instance for microphone input
      const micInstance = new Tone.UserMedia();

      // Connect the microphone input to the delay effect
      micInstance.connect(delay);

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

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop' : 'Start DAF'}
      </button>
    </div>
  );
};

export default Daf;
