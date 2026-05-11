import { useState } from "react";
import { apiClient } from "../../services/api";

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [registerByUsername, setRegisterByUsername] = useState(true);
  const [registerName, setRegisterName] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        // Validate register fields
        if (!registerName.trim()) {
          setError("Vui lòng nhập họ và tên.");
          setLoading(false);
          return;
        }

        if (!password.trim()) {
          setError("Vui lòng nhập mật khẩu.");
          setLoading(false);
          return;
        }

        // Register the user
        if (registerByUsername) {
          if (!username.trim()) {
            setError("Vui lòng nhập username.");
            setLoading(false);
            return;
          }

          await apiClient.registerByUsername({
            UsernameOrEmail: username,
            Password: password,
            FullName: registerName,
          });

          // Auto-login for username registration (no OTP required)
          await apiClient.login({
            EmailOrUsername: username,
            Password: password,
          });

          onLoginSuccess();
        } else {
          if (!email.trim()) {
            setError("Vui lòng nhập email.");
            setLoading(false);
            return;
          }

          await apiClient.register({
            UsernameOrEmail: email,
            Password: password,
            FullName: registerName,
          });

          // Store registered email and show OTP verification for email registration
          setRegisteredEmail(email);
          setShowOtpVerification(true);
          setError("");
        }
      } else {
        // Validate login fields
        if (!email.trim()) {
          setError("Vui lòng nhập email.");
          setLoading(false);
          return;
        }

        if (!password.trim()) {
          setError("Vui lòng nhập mật khẩu.");
          setLoading(false);
          return;
        }

        // Login
        await apiClient.login({
          EmailOrUsername: email,
          Password: password,
        });

        onLoginSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi xác thực.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiClient.verifyOtp({
        email: registeredEmail,
        otp: otpCode,
      });

      // After successful OTP verification, automatically login
      await apiClient.login({
        EmailOrUsername: registeredEmail,
        Password: password,
      });

      onLoginSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Lỗi xác minh OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      await apiClient.resendOtp(registeredEmail);
      setResendCooldown(60);

      // Countdown timer
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Lỗi gửi lại OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRegister = () => {
    setShowOtpVerification(false);
    setOtpCode("");
    setError("");
    setResendCooldown(0);
  };

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2 bg-[#111318]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-500/[14%] blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-indigo-500/[10%] blur-[120px] rounded-full" />
      </div>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex relative flex-col justify-between p-14 border-r border-white/10 overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-400/20 flex items-center justify-center backdrop-blur-xl">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="#c4b5fd"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>

          <span className="text-lg font-semibold text-white/90 ">
            DontMissPassword
          </span>
        </div>

        {/* Hero */}
        <div className="relative max-w-md space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-400/20 backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-violet-300 animate-pulse" />

            <span className="text-xs text-violet-200 font-medium">
              End-to-end encrypted
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">
              Quản lý mật khẩu
              <br />
              <span className="text-white/60">thông minh hơn.</span>
            </h1>

            <p className="text-base leading-relaxed text-white/55 max-w-sm">
              Lưu trữ và quản lý toàn bộ thông tin đăng nhập trong một không
              gian bảo mật hiện đại và được mã hóa hoàn toàn.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 pt-3">
            {[
              "Mã hóa AES-256 end-to-end",
              "Đồng bộ đa thiết bị",
              "Không lưu trữ mật khẩu thô",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-400/25 flex items-center justify-center">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="#6ee7b7"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <span className="text-sm text-white/70">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom card */}
        <div className="relative flex items-center gap-4 p-5 rounded-3xl bg-white/[0.05] border border-white/[0.12] backdrop-blur-xl w-fit">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="#6ee7b7"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/85">
              Zero-knowledge architecture
            </p>

            <p className="text-xs text-white/50 mt-1">
              Chúng tôi không thể đọc dữ liệu của bạn
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="relative flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-400/20 flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="#c4b5fd"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>

            <span className="text-base font-semibold text-white/90">Vault</span>
          </div>

          {/* Card */}
          <div className="rounded-3xl bg-white/[0.05] border border-white/[0.12] backdrop-blur-2xl p-8 shadow-2xl">
            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {showOtpVerification
                  ? "Xác minh email"
                  : isRegister
                    ? "Tạo tài khoản"
                    : "Chào mừng trở lại"}
              </h2>

              <p className="text-sm text-white/55 mt-2">
                {showOtpVerification
                  ? `Nhập mã OTP được gửi đến ${registeredEmail}`
                  : isRegister
                    ? "Điền thông tin để bắt đầu sử dụng"
                    : "Đăng nhập để truy cập vault của bạn"}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 mb-6 rounded-2xl bg-red-500/10 border border-red-400/20">
                <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5" />

                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* OTP Verification Form */}
            {showOtpVerification ? (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/55 mb-2">
                    Mã OTP
                  </label>

                  <input
                    type="text"
                    required
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/[0.14] text-sm text-white placeholder-white/30 outline-none transition-all focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10 text-center tracking-widest font-mono text-lg"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length < 6}
                  className="w-full mt-2 py-3.5 rounded-2xl bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang xác minh...
                    </>
                  ) : (
                    "Xác minh OTP"
                  )}
                </button>
              </form>
            ) : (
              /* Login/Register Form */
              <form onSubmit={handleLogin} className="space-y-5">
                {isRegister && (
                  <>
                    {/* Registration Type Toggle */}
                    <div className="flex gap-3 p-2 rounded-xl bg-white/[0.05] border border-white/[0.12]">
                      <button
                        type="button"
                        onClick={() => {
                          setRegisterByUsername(true);
                          setError("");
                        }}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                          registerByUsername
                            ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                            : "text-white/55 hover:text-white/70"
                        }`}
                      >
                        Username Registration
                      </button>
                      <button
                        type="button"
                        disabled
                        onClick={() => {
                          setRegisterByUsername(false);
                          setError("");
                        }}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all bg-gray-500/20 text-gray-400 cursor-not-allowed opacity-60"
                      >
                        Email Registration
                      </button>
                    </div>

                    {/* Email Registration Maintenance Notice */}
                    <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-orange-500/10 border border-orange-400/30">
                      <svg
                        className="w-5 h-5 text-orange-300 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xs text-orange-200 leading-relaxed">
                        <span className="font-semibold block mb-1">
                          ⚙️ Đang nâng cấp hệ thống
                        </span>
                        Đăng ký Email đang bảo trì. Vui lòng sử dụng Username để
                        tiếp tục.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/55 mb-2">
                        Họ và tên
                      </label>

                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Nguyen Van A"
                        className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/[0.14] text-sm text-white placeholder-white/30 outline-none transition-all focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                      />
                    </div>
                  </>
                )}

                {isRegister && !registerByUsername ? (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/55 mb-2">
                      Username
                    </label>

                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="username.example"
                      className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/[0.14] text-sm text-white placeholder-white/30 outline-none transition-all focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>
                ) : isRegister && registerByUsername ? (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/55 mb-2">
                        Username
                      </label>

                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your_username"
                        className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/[0.14] text-sm text-white placeholder-white/30 outline-none transition-all focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                      />
                    </div>

                    <div className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-400/20">
                      <svg
                        className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xs text-amber-200 leading-relaxed">
                        <strong>Lưu ý:</strong> Tài khoản này không xác minh qua
                        email. Hãy chủ động bảo mật thông tin để tránh mất tài
                        khoản.
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/55 mb-2">
                      Username
                    </label>

                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="username.example"
                      className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/[0.14] text-sm text-white placeholder-white/30 outline-none transition-all focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/55">
                      Mật khẩu
                    </label>

                    {!isRegister && (
                      <a
                        href="#"
                        className="text-[11px] text-violet-300 hover:text-violet-200 transition-colors"
                      >
                        Quên mật khẩu?
                      </a>
                    )}
                  </div>

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/[0.14] text-sm text-white placeholder-white/30 outline-none transition-all focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-2xl bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : isRegister ? (
                    "Tạo tài khoản"
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-white/[0.12]" />

              <span className="text-[10px] uppercase tracking-widest text-white/35">
                hoặc
              </span>

              <div className="flex-1 h-px bg-white/[0.12]" />
            </div>

            {/* Resend OTP Section */}
            {showOtpVerification && (
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm text-white/55">Chưa nhận được mã?</p>
                <button
                  onClick={handleResendOtp}
                  disabled={loading || resendCooldown > 0}
                  className="text-violet-300 hover:text-violet-200 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {resendCooldown > 0
                    ? `Gửi lại (${resendCooldown}s)`
                    : "Gửi lại OTP"}
                </button>
              </div>
            )}

            {/* Toggle */}
            {!showOtpVerification && (
              <>
                <p className="text-center text-sm text-white/55">
                  {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
                  <button
                    onClick={() => {
                      setIsRegister(!isRegister);
                      setRegisterByUsername(true);
                      setError("");
                    }}
                    className="text-violet-300 hover:text-violet-200 font-semibold transition-colors"
                  >
                    {isRegister ? "Đăng nhập" : "Đăng ký miễn phí"}
                  </button>
                </p>
              </>
            )}

            {/* Back Button for OTP */}
            {showOtpVerification && (
              <div className="mt-6">
                <button
                  onClick={handleBackToRegister}
                  className="w-full py-3 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] text-white text-sm font-semibold transition-all duration-200 border border-white/[0.14]"
                >
                  ← Quay lại
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
