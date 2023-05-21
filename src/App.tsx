import { useReactMediaRecorder } from "react-media-recorder";
import { css, keyframes } from "@emotion/css";
import { useState } from "react";
import logo from "./logo.png";

const wrapperStyle = css({
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
});

const bannerStyle = css({
  justifyContent: "space-between",
  alignItems: "center",
  display: "flex",
  padding: 10,
  background: "red",
});

const bannerTextAnimation = keyframes({
  "from, 0%, 60%, to": {
    opacity: 1,
  },
  "40%": {
    opacity: 0.75,
  },
});

const bannerText = css({
  animation: `${bannerTextAnimation} 1.5s ease-in-out infinite`,
  color: "white",
  fontWeight: 500,
});

const contentStyle = css({
  paddingLeft: 8,
  paddingRight: 8,
});

const codeStyle = css({
  background: "#eee",
  padding: 4,
  borderRadius: 3,
  fontSize: "0.90em",
  fontFamily:
    "SFMono-Medium, SF Mono, Segoe UI Mono, Roboto Mono, Ubuntu Mono, Menlo, Consolas, Courier New, monospace",
});

const buttonStyle = css({
  marginBottom: 5,
  "& + &": {
    marginLeft: 5,
  },
});

const videoStyle = css({
  width: "100%",
  maxWidth: 800,
});

export default () => {
  const [uploaded, setUploaded] = useState(false);
  const [uploadURL, setUploadURL] = useState("");
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ screen: true, video: true });

  const src = mediaBlobUrl || undefined;

  const recording = status === "recording";
  const stopped = status === "stopped";

  const upload = async () => {
    setUploaded(true);
    if (mediaBlobUrl) {
      const fileName = [...mediaBlobUrl.split("/")].reverse()[0];
      const videoBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
      const formData = new FormData();

      formData.append("file", videoBlob, `${fileName}.mp4`);

      fetch("https://root-grizzled-philodendron.glitch.me/upload", {
        method: "POST",
        mode: "cors",
        body: formData,
      })
        .then((res) => res.json())
        .then((r) => {
          setUploadURL(r.url);
        })
        .catch((e) => console.error(e));
    }
  };

  return (
    <div className={wrapperStyle}>
      {recording && (
        <div className={bannerStyle}>
          <div className={bannerText}>RECORDING IN PROGRESS</div>
          <button onClick={stopRecording}>Stop</button>
        </div>
      )}
      <header style={{ position: "relative" }}>
        <img
          src={logo}
          alt="Logo"
          style={{ position: "absolute", top: "0", right: "0", width: '90px' }} 
        />
        {/* Other header content */}
      </header>{" "}
      <div className={contentStyle}>
        <h1>Recording user's screen</h1>

        <ol>
          <li>
            Click "Start recording" below, then record your screen and audio
            briefly.
          </li>
          <li>
            When you are done, click "Stop recording" to preview and optionally
            upload the result.
          </li>
        </ol>

        <div>
          <button
            className={buttonStyle}
            disabled={recording}
            onClick={startRecording}
          >
            Start recording
          </button>
          <button
            className={buttonStyle}
            disabled={!recording}
            onClick={stopRecording}
          >
            Stop recording
          </button>
        </div>
        {recording && <div>recording in progress...</div>}
        {stopped && (
          <>
            <h2>Preview</h2>
            <video className={videoStyle} src={src} controls />
            <p>
              {uploadURL ? (
                <>
                  Uploaded to{" "}
                  <a target="_blank" rel="noreferrer" href={uploadURL}>
                    {uploadURL}
                  </a>
                </>
              ) : (
                <button
                  className={buttonStyle}
                  disabled={uploaded}
                  onClick={() => upload()}
                >
                  {uploaded ? "uploading..." : "upload"}
                </button>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
