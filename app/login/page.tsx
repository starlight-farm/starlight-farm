"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Header from "../../components/Header";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      alert("로그인 실패: " + error.message);
    } else {
      alert("로그인 성공!");
      window.location.href = "/mypage";
    }
  };

  return (
    <>
      <Header />
  
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="mb-2 text-center text-4xl font-bold text-white">
          별빛목장 로그인
        </h1>

        <p className="mb-8 text-center text-slate-300">
          나의 밤하늘로 들어가기 ✨
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 p-3 font-bold text-white hover:bg-blue-600"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 flex justify-center gap-4 text-sm text-slate-300">
          <Link href="/signup" className="hover:text-white">
            회원가입
          </Link>

          <span className="text-slate-600">|</span>

          <Link href="/find-id" className="hover:text-white">
            아이디 찾기
          </Link>

          <span className="text-slate-600">|</span>

          <Link href="/find-password" className="hover:text-white">
            비밀번호 찾기
          </Link>
        </div>
      </div>
    </main>
  </>
);
}