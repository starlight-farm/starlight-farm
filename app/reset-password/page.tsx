"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim() || !passwordCheck.trim()) {
      alert("새 비밀번호를 입력해주세요.");
      return;
    }

    if (password !== passwordCheck) {
      alert("비밀번호가 서로 다릅니다.");
      return;
    }

    if (password.length < 6) {
      alert("비밀번호는 6자리 이상으로 입력해주세요.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password.trim(),
    });

    if (error) {
      alert("비밀번호 변경 실패: " + error.message);
      return;
    }

    alert("비밀번호가 변경되었습니다. 다시 로그인해주세요.");
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="mb-2 text-center text-4xl font-bold text-white">
          새 비밀번호 설정
        </h1>

        <p className="mb-8 text-center text-slate-300">
          새로 사용할 비밀번호를 입력해주세요.
        </p>

        <form onSubmit={updatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="새 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black"
          />

          <input
            type="password"
            placeholder="새 비밀번호 확인"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-400 p-3 font-bold text-slate-950 hover:bg-yellow-300"
          >
            비밀번호 변경하기
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-300">
          <Link href="/login" className="hover:text-white">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}