//
const modelId: string = 'eleven_monolingual_v1';
const voiceSettings: { stability: number; similarity_boost: number } = {
  stability: 0.5,
  similarity_boost: 0.5
};

export const convertTextToSpeech = async (
  voiceId: string,
  textToConvert: string
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          accept: 'audio/mpeg',
          'xi-api-key': '01d5d014d919e54c2c258c248803f45a',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: textToConvert,
          model_id: modelId,
          voice_settings: voiceSettings
        })
      }
    );

    if (!response.ok) {
      throw new Error('Text to speech conversion failed.');
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    console.log('audio is active')
    return audioUrl; // Return the audioUrl
  } catch (error) {
    console.error('An error occurred:', error.message);
    throw error;
  }
};
