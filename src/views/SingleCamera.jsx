import React, { useEffect, useState } from "react";
import { replace, useLocation, useNavigate } from "react-router-dom";
import ReactHlsPlayer from "react-hls-player";

import Timeline from "./Timeline";
import { useAuth } from "../contexts/AuthProvider";

const SingleCamera = () => {
  const navigator = useNavigate();
  const location = useLocation();
  const { camera } = location.state;
  const [streamUrl, setStreamUrl] = useState("");

  const { AuthenticatedFetch } = useAuth();
  const [recordingTime, setRecordingTime] = useState(null);

  const handleStreamUrlChange = (url) => {
    setStreamUrl(url);
  };

  useEffect(() => {
    console.log("here!!!");
    const { id, has_recording } = camera;
    if (has_recording) {
      AuthenticatedFetch({
        method: "GET",
        url: `${
          import.meta.env.VITE_API_ROOT
        }/api/shared-cameras/${id}/recording`,
      }).then((res) => {
        const { recording_start, recording_end } = res;
        setRecordingTime({ recording_start, recording_end });
      });
    }
    setStreamUrl(camera.streams[3].url);
  }, [camera]);

  console.log(camera);

  return (
    <div className="w-full">
      <div
        className="fixed left-10 top-10 cursor-pointer"
        onClick={() => navigator("/cameras", replace)}
      >
        <svg
          x="0px"
          y="0px"
          width="61.883px"
          height="61.882px"
          viewBox="0 0 122.883 122.882"
          className="fill-slate-900 hover:fill-slate-700"
        >
          <g>
            <path d="M61.441,0L61.441,0l0.001,0.018c16.974,0,32.335,6.872,43.443,17.98s17.98,26.467,17.98,43.441h0.018v0.002l0,0h-0.018 c0,16.976-6.873,32.335-17.98,43.443c-11.109,11.107-26.467,17.979-43.442,17.979v0.018h-0.002l0,0v-0.018 c-16.975,0-32.335-6.872-43.443-17.98C6.89,93.775,0.018,78.417,0.018,61.442H0v-0.001V61.44h0.018 c0-16.975,6.872-32.334,17.98-43.443C29.106,6.89,44.465,0.018,61.44,0.018L61.441,0L61.441,0L61.441,0z M71.701,42.48 c1.908-1.962,1.863-5.101-0.098-7.009c-1.963-1.909-5.102-1.865-7.01,0.097L42.755,58.088l3.553,3.456l-3.568-3.46 c-1.911,1.971-1.863,5.118,0.108,7.029c0.058,0.056,0.116,0.109,0.175,0.162l21.571,22.057c1.908,1.962,5.047,2.006,7.01,0.097 c1.961-1.908,2.006-5.047,0.098-7.01L53.227,61.529L71.701,42.48L71.701,42.48z" />
          </g>
        </svg>
      </div>
      <div className="w-full">
        {/* <img src={streamUrl} /> */}
        <ReactHlsPlayer
          src={streamUrl}
          autoPlay={true}
          controls={false}
          width="100%"
          height="auto"
        />
        {camera.has_recording && (
          <Timeline
            cameraId={camera.id}
            range={recordingTime}
            onStreamUrlChange={handleStreamUrlChange}
          />
        )}
      </div>
    </div>
  );
};

export default SingleCamera;
