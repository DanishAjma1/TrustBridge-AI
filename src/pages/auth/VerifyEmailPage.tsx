import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { AlertCircle, Mail } from "lucide-react";

interface VerifyEmailPageProps {
  email: string;
  onVerified: () => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ email, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resent, setResent] = useState(false);
 const URL = import.meta.env.VITE_BACKEND_URL;
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${URL}/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (res.ok) {
        onVerified();
      } else {
        setError(data.message || "Invalid OTP. Please check your email and try again.");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError(null);
    setResent(false);
    try {
      const res = await fetch(`${URL}/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setResent(true);
      } else {
        setError(data.message || "Failed to resend code.");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary-50 to-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <Mail size={40} className="text-primary-600 mb-2" />
          <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
          <p className="text-gray-600 text-center">
            We sent a 6-digit code to <span className="font-semibold">{email}</span>.<br />
            Enter it below to continue.
          </p>
        </div>
        {error && (
          <div className="mb-4 bg-error-50 border border-error-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle size={18} className="text-error-500 flex-shrink-0 mt-0.5" />
            <span className="text-error-700 text-sm">{error}</span>
          </div>
        )}
        <form className="space-y-5" onSubmit={handleVerify}>
          <input
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-center text-lg tracking-widest"
            placeholder="Enter 6-digit code"
            required
          />
          <Button type="submit" fullWidth isLoading={isLoading} className="h-12 rounded-xl text-base font-medium">
            Verify
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={isLoading}
            className="text-primary-600 hover:underline font-medium disabled:opacity-50"
          >
            Resend Code
          </button>
          {resent && <span className="ml-2 text-green-600 text-sm">Code resent!</span>}
        </div>
      </div>
    </div>
  );
};
