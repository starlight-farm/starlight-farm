"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function FindIdPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [foundEmail, setFoundEmail] = useState("");

  const findId = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      alert("이름과 휴대폰 번호를 입력해주세요.");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("email")
      .eq("name", name.trim())
      .eq("phone", phone.trim())
      .maybeSingle();

    if (error) {
      alert("아이디 찾기 실패: " + error.message);
      return;
    }

    if (!data?.email) {
      setFoundEmail("");
      alert("일치하는 회원 정보를 찾지 못했습니다.");
      return;
    }

    setFoundEmail(data.email);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="mb-2 text-center text-4xl font-bold text-white">
          아이디 찾기
        </h1>

        <p className="mb-8 text-center text-slate-300">
          가입 시 입력한 이름과 휴대폰 번호를 입력해주세요.
        </p>

        <form onSubmit={findId} className="space-y-4">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black"
          />

          <input
            type="text"
            placeholder="휴대폰 번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-400 p-3 font-bold text-slate-950 hover:bg-yellow-300"
          >
            아이디 찾기
          </button>
        </form>

        {foundEmail && (
          <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-center">
            <p className="mb-2 text-sm text-slate-400">가입된 아이디</p>
            <p className="text-xl font-bold text-yellow-300">{foundEmail}</p>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-slate-300">
          <Link href="/login" className="hover:text-white">
            로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}