"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function FindPasswordPage() {
  const [email, setEmail] = useState("");

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("이메일을 입력해주세요.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      alert("비밀번호 재설정 메일 발송 실패: " + error.message);
      return;
    }

    alert("비밀번호 재설정 메일을 보냈습니다. 이메일을 확인해주세요.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="mb-2 text-center text-4xl font-bold text-white">
          비밀번호 찾기
        </h1>

        <p className="mb-8 text-center text-slate-300">
          가입한 이메일로 비밀번호 재설정 메일을 보내드립니다.
        </p>

        <form onSubmit={resetPassword} className="space-y-4">
          <input
            type="email"
            placeholder="가입한 이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-400 p-3 font-bold text-slate-950 hover:bg-yellow-300"
          >
            재설정 메일 보내기
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