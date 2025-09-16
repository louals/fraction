import React, { useState } from "react";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase.ts";
import phone from "../../assets/images/phone.png";
import logocomplet from "../../assets/images/logocomplet.png";
import { useNavigate } from "react-router-dom";
import Loader from "../loading/logo_loader.tsx";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in user:", userCredential.user);
      setLoading(false);
      navigate("/"); // redirect after login
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 md:px-8"
      style={{ background: "linear-gradient(135deg, #E4E5FF, #F3BBCE9D, #FF99A54D)" }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-[1600px] justify-between items-center">
        {/* Left - Form Card */}
        <div className="w-full md:w-6/12 bg-white rounded-3xl shadow-2xl flex flex-col justify-center p-6 md:p-12 mb-10 md:mb-0 h-auto md:h-[790px]">
          <div className="mb-6 text-center">
            <img src={logocomplet} alt="logo fraction" className="w-[200px] md:w-[299px] h-auto mx-auto" />
            <p className="text-[#FF99A5] text-2xl md:text-[32px] font-bold mt-2">Log in</p>
          </div>

          <div className="mb-4 flex flex-col">
            <p className="text-sm text-gray-600 mb-2 text-left">With social:</p>
            <div className="flex justify-center gap-4">
              <button className="flex items-center justify-center transition-colors rounded-lg p-2 hover:bg-gray-100">
                <FaGoogle size={40} />
              </button>
              <button className="flex items-center justify-center transition-colors rounded-lg p-2 hover:bg-gray-100">
                <FaFacebook size={40} />
              </button>
              <button className="flex items-center justify-center transition-colors rounded-lg p-2 hover:bg-gray-100">
                <FaApple size={40} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-1 border-transparent" />
            <span className="text-[#FF99A5] text-xl md:text-[32px] font-semibold">or</span>
            <hr className="flex-1 border-transparent" />
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter e-mail here ..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a052e0] placeholder-gray-400"
            />

            <input
              type="password"
              placeholder="Password ..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a052e0] placeholder-gray-400"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex flex-col md:flex-row justify-end gap-2 text-xs text-gray-500 mt-2">
              <a href="#" className="hover:underline">I forgot my e-mail</a>
              <a href="#" className="hover:underline">I forgot my password</a>
            </div>

            <button
  type="submit"
  disabled={loading}
  className="w-full md:w-[230px] bg-[#3A3178] text-white py-3 rounded-[21.5px] mx-auto hover:opacity-90 transition mt-4 flex justify-center items-center"
>
  {loading ? <Loader /> : "Log in"}
</button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Go to{" "}
            <a href="/signup" className="text-[#3b3b64] font-medium hover:underline">Sign up</a>
          </p>
        </div>

        {/* Right - Phone with floating rectangles */}
        <div className="hidden md:flex w-full md:w-5/12 items-center justify-end relative">
          <div className="relative">
            <img src={phone} alt="Phone Mockup" className="relative z-10 w-[300px] md:w-[458px] h-auto mr-4 md:mr-12" />
          </div>
          <div className="absolute top-[60%] right-[60%] w-[138px] h-[82px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-50" />
          <div className="absolute top-[16%] right-[15%] w-[98px] h-[56px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/70 shadow-lg z-20" />
          <div className="absolute top-[18%] right-[25%] w-16 h-12 rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg" />
          <div className="absolute top-[12%] left-[38%] w-[26px] h-[21px] rounded-[5px] border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-40" />
          <div className="absolute top-[15%] left-[33%] w-[47px] h-[39px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-30" />
          <div className="absolute top-[19%] left-[36%] w-[60px] h-[40px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-0" />
          <div className="absolute bottom-[33%] right-[76%] w-[86px] h-[74px] rounded-[10px] border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-50" />
          <div className="absolute top-[10%] right-[12%] w-[56px] h-[40px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-30" />
          <div className="absolute top-[5%] right-[18%] w-[40px] h-[40px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-50" />
          <div className="absolute top-[55%] right-[57%] w-[40px] h-[40px] rounded-lg border border-white/60 backdrop-blur-[2px] bg-white/60 shadow-lg z-20" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
