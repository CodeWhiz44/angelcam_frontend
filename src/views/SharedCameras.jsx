import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate } from "react-router-dom";

const SharedCameras = () => {
  const { AuthenticatedFetch } = useAuth();
  const navigator = useNavigate();

  const [cameras, setCameras] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    AuthenticatedFetch({
      method: "GET",
      url: `${import.meta.env.VITE_API_ROOT}/api/cameras`,
    }).then((res) => {
      setCameras(res.results);
      setIsLoaded(true);
      setTimeout(() => setVideoLoaded(true), 3000);
    });
  }, []);

  return (
    <div className="flex flex-col items-center">
      {isLoaded ? (
        <div hidden={!videoLoaded}>
          <h1>Shared cameras</h1>
          <div className="flex gap-8 mt-10">
            {cameras.map((camera, idx) => (
              <div
                key={idx}
                className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                onClick={() =>
                  navigator(`/camera/${camera.id}`, { state: { camera } })
                }
              >
                <img
                  className="rounded-t-lg h-[60%]"
                  src={camera.streams[0].url}
                  alt="Camera snapshot"
                />
                <div className="p-5">
                  <h5 className="mb-2 text-2xl text-left flex items-center font-bold tracking-tight text-gray-900 dark:text-white">
                    <div
                      className={`size-3 ${
                        camera.status == "online"
                          ? "bg-green-500"
                          : camera.status == "offline"
                          ? "bg-red-500"
                          : "bg-slate-500"
                      } rounded-full mr-2`}
                    ></div>
                    {camera.name}
                  </h5>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 text-right">
                    {`${camera.owner.first_name} ${camera.owner.last_name}`}
                    <br></br>
                    {camera.snapshot.created_at}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default SharedCameras;
