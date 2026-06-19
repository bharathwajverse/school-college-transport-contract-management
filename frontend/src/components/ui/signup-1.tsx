import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Bus, Sparkles } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";

interface Signup1Props {
  heading?: string;
  logo?: {
    url: string;
    src?: string;
    alt?: string;
    title?: string;
  };
  signupText?: string;
  googleText?: string;
  loginText?: string;
  loginUrl?: string;
}

const Signup1 = ({
  heading = "Create an Account",
  logo = {
    url: "/",
  },
  googleText = "Sign up with Google",
  signupText = "Create an account",
  loginText = "Already have an account?",
  loginUrl = "/login",
}: Signup1Props) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STAFF");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setSubmitting(true);
    
    try {
      await register(fullName, email, password, role);
      setSuccessMsg("Account created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#080B14] h-screen text-white relative overflow-hidden flex items-center justify-center">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8B7CFF]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#A78BFA]/5 rounded-full blur-3xl" />

      <div className="flex h-full items-center justify-center px-4 relative z-10 w-full max-w-sm">
        <div className="border-white/5 bg-[#121827]/70 flex w-full flex-col items-center gap-y-8 rounded-3xl border px-6 py-10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-center gap-y-2">
            {/* Custom Brand Logo */}
            <div className="flex items-center justify-center w-12 h-12 rounded-3xl bg-gradient-to-tr from-[#8B7CFF] to-[#A78BFA] text-white text-xl font-bold mb-1 shadow-lg shadow-[#8B7CFF]/20">
              <Bus className="w-5 h-5 text-white" />
            </div>
            {heading && <h1 className="text-xl font-black text-white tracking-tight">{heading}</h1>}
            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">
              Register transport credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-4">
              
              {/* Status Messages */}
              {error && (
                <div className="p-3 bg-red-955/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl animate-fade-in">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-green-955/20 border border-green-500/20 text-green-400 text-xs font-bold rounded-2xl animate-fade-in">
                  {successMsg}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0D1220] text-white border border-white/10 rounded-2xl text-xs focus:ring-4 focus:ring-[#8B7CFF]/10 focus:border-[#8B7CFF]/60 outline-none transition-all placeholder-[#94A3B8]/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0D1220] text-white border border-white/10 rounded-2xl text-xs focus:ring-4 focus:ring-[#8B7CFF]/10 focus:border-[#8B7CFF]/60 outline-none transition-all placeholder-[#94A3B8]/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0D1220] text-white border border-white/10 rounded-2xl text-xs focus:ring-4 focus:ring-[#8B7CFF]/10 focus:border-[#8B7CFF]/60 outline-none transition-all placeholder-[#94A3B8]/30"
                />
              </div>

              <div className="flex flex-col gap-2">
                <select
                  className="w-full px-4 py-3 bg-[#0D1220] text-white border border-white/10 rounded-2xl text-xs focus:ring-4 focus:ring-[#8B7CFF]/10 focus:border-[#8B7CFF]/60 outline-none transition-all cursor-pointer appearance-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  style={{
                    backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394A3B8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1rem',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <option value="STAFF" className="bg-[#121827] text-white">Staff</option>
                  <option value="ADMIN" className="bg-[#121827] text-white">Admin</option>
                  <option value="VIEWER" className="bg-[#121827] text-white">Viewer</option>
                </select>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-2.5 bg-gradient-to-tr from-[#8B7CFF] to-[#A78BFA] text-white text-xs font-bold rounded-2xl shadow-lg shadow-[#8B7CFF]/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-40"
                >
                  {submitting ? "Registering..." : signupText}
                </button>
                <button 
                  type="button" 
                  className="w-full py-2.5 bg-[#121827] border border-white/10 text-[#94A3B8] text-xs font-bold rounded-2xl hover:bg-white/5 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FcGoogle className="size-4" />
                  {googleText}
                </button>
              </div>
            </div>
          </form>

          <div className="text-[#94A3B8] flex justify-center gap-1.5 text-xs">
            <p>{loginText}</p>
            <Link
              to={loginUrl}
              className="text-[#8B7CFF] hover:text-[#A78BFA] transition-colors font-bold hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Signup1 };
