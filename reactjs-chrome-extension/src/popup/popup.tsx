import React, { useState, useEffect } from "react";
import "./popup.css";
import { convertTextToSpeech } from "./TextFunction";
import { translateText } from "./translateText";
import { pauseOnStart, handleVideo, uploadVoices } from "./popupFunctions";
import { FaPlay, FaPause, FaVolumeMute } from "react-icons/fa";
import DotLoader from "react-spinners/DotLoader";

let videoID;

const Popup = () => {
  //something is here

  const [subtitles, setSubtitles] = useState([]);
  const [interpretationLanguage, setInterpretationLanguage] = useState("");
  const [inputLanguage, setInputLanguage] = useState("");
  const [parag, setParag] = useState("");
  const [recording, setRecording] = useState("");

  //this send message to the background script
  chrome.runtime.sendMessage({ type: "POPUP_READY" });

  let uploadVoicesCalled = false;

  chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      if (message.type === "YOUTUBE_VIDEO_ID" && !uploadVoicesCalled) {
        videoID = message.videoID;
        uploadVoicesCalled = true; // Set the flag to indicate that it's been called

        console.log("Received YouTube Video ID in popup:", videoID);
      }
    }
  );

  const mute = () => {
    chrome.runtime.sendMessage({ action: "toggleMute" });
  };

  mute();

  const joinSubtitles = (subtitles) => {
    const joinedSubtitles = subtitles
      .map((subtitle) => subtitle.text)
      .join(", - - ");
    return joinedSubtitles;
  };

  const fetchSubtitles = async (
    videoID,
    lang = inputLanguage,
    interpretationLanguage
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/captions?videoID=${videoID}&lang=${lang}`
      );
      const VoiceR = await fetch(
        `http://localhost:5000/api/uploadVoice?videoID=${videoID}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      // if (VoiceR) {
      //   const data = await response.json();
      //   const data2 = await VoiceR.json();
      //   const subtitles = data.subtitles;
      //   // console.log(subtitles);
      //   if (joinSubtitles(subtitles)) {
      //     console.log(joinSubtitles(subtitles));
      //     const getTranslation = async () => {
      //       const joinedSubtitles = joinSubtitles(subtitles);
      //       // setParag(joinedSubtitles);

      //       const quicken = await translateText(
      //         inputLanguage,
      //         joinedSubtitles,
      //         interpretationLanguage
      //       );
      //       const translatedText = quicken.data.translatedText;
      //       console.log(translatedText);

      //       convertTextToSpeech(data2.voice_id, translatedText).then(
      //         (audioUrl) => {
      //           setRecording(audioUrl);
      //         }
      //       );

      //       setParag(translatedText);
      //     };
      //     getTranslation();
      //   } else {
      //     console.log("nothing here");
      //   }
      //   setSubtitles(subtitles);
      // }
    } catch (error) {
      console.error("Error fetching subtitles:", error);
    }
  };

  const handleInputLanguageChange = (e) => {
    setInputLanguage(e.target.value);
  };

  const handleLanguageChange = async (e) => {
    setInterpretationLanguage(e.target.value);
    await fetchSubtitles(videoID, inputLanguage, e.target.value);
  };

  pauseOnStart();

  return (
    <div className="m-2 flex flex-col items-center">
      {recording ? (
        <div className="text-center mt-2">
          <p className="text-gray-500">Video Translator</p>
        </div>
      ) : (
        <div className="text-center mt-3 my-3">
          <h3 className="text-4xl text-blue-700 font-bold">Selman</h3>
          <p className="text-gray-500">Video Translator</p>
        </div>
      )}

      {recording ? (
        <>
          <div className="flex items-center justify-center">
            <audio
              controls
              id="audioElement"
              src={recording}
              className="rounded-lg shadow-lg invisible"
            >
              Your browser does not support the audio element.
            </audio>
          </div>

          <div className=" flex justify-center space-x-10">
            <button
              className="text-green-500 hover:text-green-700"
              onClick={handleVideo}
            >
              <FaPlay className="w-5 h-5" />
            </button>

            <button
              className="text-yellow-500 hover:text-yellow-700"
              onClick={() => {
                pauseOnStart();
              }}
            >
              <FaPause className="w-5 h-5" />
            </button>
          </div>
        </>
      ) : (
        <div
          className="bg-white w-full rounded-lg p-4 mb-4 overflow-auto"
          style={{ maxHeight: "200px" }}
        >
          {interpretationLanguage ? (
            <div className="flex justify-center">
              <DotLoader color="#36d7b7" />
            </div>
          ) : (
            <p className="poppin text-gray-800">
              Select Language and please wait....
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col items-center justify-end p-4">
        <div className="flex flex-col justify-center space-y-2">
          <select
            className="bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            value={inputLanguage}
            onChange={handleInputLanguageChange}
          >
            <option>Video Lang</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="ha">Hausa</option>
            <option value="ig">Igbo</option>
            <option value="yo">Yoruba</option>
            <option value="ko">Korean</option>
            <option value="ja">Japanese</option>
            <option value="ar">Arabic</option>
            <option value="de">German</option>
            <option value="pt">Portuguese</option>
            <option value="it">Italian</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese</option>
            <option value="hi">Hindi</option>
            <option value="tr">Turkish</option>
            <option value="vi">Vietnamese</option>
            <option value="nl">Dutch</option>
            <option value="sv">Swedish</option>
            <option value="pl">Polish</option>
          </select>
          <select
            className="bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            value={interpretationLanguage}
            onChange={handleLanguageChange}
          >
            <option>Out Lang</option>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="ha">Hausa</option>
            <option value="ig">Igbo</option>
            <option value="yo">Yoruba</option>
            <option value="ko">Korean</option>
            <option value="ja">Japanese</option>
            <option value="ar">Arabic</option>
            <option value="de">German</option>
            <option value="pt">Portuguese</option>
            <option value="it">Italian</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese</option>
            <option value="hi">Hindi</option>
            <option value="tr">Turkish</option>
            <option value="vi">Vietnamese</option>
            <option value="nl">Dutch</option>
            <option value="sv">Swedish</option>
            <option value="pl">Polish</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Popup;
