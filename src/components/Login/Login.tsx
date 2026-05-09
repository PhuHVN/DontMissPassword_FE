import { useState } from "react";
import { apiClient } from "../../services/api";

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [registerName, setRegisterName] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister) {
        await apiClient.register({
          email,
          password,
          fullName: registerName,
        });

        alert("Đăng ký thành công!");

        await apiClient.login({
          email,
          password,
        });
      } else {
        await apiClient.login({
          email,
          password,
        });
      }

      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Lỗi xác thực.");
    } finally {
      setLoading(false);
    }
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
                {isRegister ? "Tạo tài khoản" : "Chào mừng trở lại"}
              </h2>

              <p className="text-sm text-white/55 mt-2">
                {isRegister
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

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {isRegister && (
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
              )}

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/55 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/[0.14] text-sm text-white placeholder-white/30 outline-none transition-all focus:border-violet-400/50 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

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

            {/* Divider */}
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-white/[0.12]" />

              <span className="text-[10px] uppercase tracking-widest text-white/35">
                hoặc
              </span>

              <div className="flex-1 h-px bg-white/[0.12]" />
            </div>

            {/* Toggle */}
            <p className="text-center text-sm text-white/55">
              {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="text-violet-300 hover:text-violet-200 font-semibold transition-colors"
              >
                {isRegister ? "Đăng nhập" : "Đăng ký miễn phí"}
              </button>
            </p>

            {/* Demo account */}
            <div className="mt-8 p-5 rounded-2xl bg-white/[0.04] border border-white/[0.1]">
              <p className="text-[10px] uppercase tracking-widest text-white/35 font-bold mb-4">
                Tài khoản trải nghiệm
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">Email</span>

                  <span className="text-xs text-white/80 font-mono">
                    user@example.com
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">Password</span>

                  <span className="text-xs text-white/80 font-mono">
                    Password@123
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
