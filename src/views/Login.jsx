import React, { useRef, useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

const Login = () => {
  const { login } = useAuth();
  const navigator = useNavigate();

  const usernameRef = useRef();
  const emailRef = useRef();
  const tokenRef = useRef();

  const [isLogging, setIsLogging] = useState(false);

  const userSignin = async () => {
    setIsLogging(true);
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const token = tokenRef.current.value;

    if (
      (await login({
        full_name: username,
        email: email,
        personal_token: token,
      })) == true
    ) {
      navigator("/cameras", replace);
    } else {
      alert("Incorrect personal token for given user");
      setIsLogging(false)
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 ">
      <div className="bg-[#1f2023] bg-opacity-50 w-full h-full absolute backdrop-blur"></div>
      <div className="bg-[#1f2023] text-white rounded-lg w-[418px] mx-3 md:mx-0 overflow-hidden relative z-10 py-3 px-[18px]">
        <div className="py-[6px] px-3">
          <h2 className="text-[26px] font-semibold m-0">User Login</h2>

          <div className="my-7">
            <input
              id="text"
              ref={usernameRef}
              type="text"
              label="Name"
              className="w-full p-3 mb-3 opacity-50"
              placeholder="Username"
              required
            />
            <input
              id="email"
              ref={emailRef}
              type="email"
              label="Email address"
              className="w-full p-3 mb-3 opacity-50"
              placeholder="Email Address"
              required
            />
            <input
              id="token"
              ref={tokenRef}
              type="password"
              label="Password"
              className="w-full p-3 opacity-50"
              placeholder="Personalized Token"
              required
            />
          </div>
          <div className="flex relative my-5">
            <button
              className="w-full h-[46px] text-[16px] leading-[16px] !font-semibold border-[1px] border-solid bg-[#5858e6] border-[#5858e6] [box-shadow:0_1px_2px_rgba(0,0,0,.07)] inline-flex items-center justify-center relative rounded-[4px] cursor-pointer [transition:.24s_ease-in-out] outline-[none] px-[18px] py-[3px] no-underline text-[#fff] overflow-hidden hover:opacity-70"
              onClick={userSignin}
              disabled={isLogging}
            >
              {isLogging ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white"
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
                </div>
              ) : (
                "Log in"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
