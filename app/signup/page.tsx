"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Header from "../../components/Header";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("이름, 이메일, 비밀번호를 입력해주세요.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
      },
    });

    if (error) {
      alert("회원가입 실패: " + error.message);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      alert("회원가입은 되었지만 사용자 ID를 가져오지 못했습니다.");
      return;
    }

    const { count, error: countError } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    if (countError) {
      alert("회원 수 확인 실패: " + countError.message);
      return;
    }

    const signupBonusStars = (count ?? 0) < 50 ? 20 : 0;

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      stars: signupBonusStars,
      royal_stars: 0,
      total_stars: signupBonusStars,
    });

    if (profileError) {
      alert("회원정보 저장 실패: " + profileError.message);
      return;
    }

    if (signupBonusStars > 0) {
      alert("회원가입 성공! 오픈 기념 별 20개가 지급되었습니다.");
    } else {
      alert("회원가입 성공! 나의 밤하늘이 생성되었습니다.");
    }
    window.location.href = "/login";
  };

  return (
    <>
      <Header />
  
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <h1 className="mb-2 text-center text-4xl font-bold text-white">
          별빛목장 회원가입
        </h1>

        <p className="mt-6 text-center text-sm text-slate-400">
          이미 회원이신가요?
        </p>

        <a
          href="/login"
          className="mt-2 block text-center font-bold text-yellow-300 hover:text-yellow-200"
        >
          로그인 하러가기 →
        </a>

        <p className="mb-6 text-center text-slate-300">
          요거트를 구매하고 별을 모아
          <br />
          나만의 밤하늘을 만들어보세요 ✨
        </p>

        <div className="mb-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-5 text-center">
          <p className="font-bold text-yellow-300">
            🎉 오픈 기념 이벤트
          </p>

          <p className="mt-2 text-2xl font-black text-white">
            선착순 50명
          </p>

          <p className="mt-1 text-lg font-bold text-yellow-300">
            회원가입 시 별 20개 지급
          </p>

          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>🥛 500ml 구매 인증 시 별 1개 적립</p>
            <p>🍶 1L 구매 인증 시 별 2개 적립</p>
            <p>🌙 적립한 별로 나만의 밤하늘 꾸미기</p>
            <p>🎁 별 40개 모으면 요거트 1L 교환</p>
            <p className="text-xs text-slate-500">
              ※ 무료 교환 상품은 배송비가 별도 발생할 수 있습니다.
            </p>
          </div>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black"
          />

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

          <input
            type="tel"
            placeholder="휴대폰번호"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black"
          />

          <input
            type="text"
            placeholder="주소"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-black"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-500 p-3 font-bold text-white hover:bg-blue-600"
          >
            가입하기
          </button>
        </form>
      </div>
    </main>
  </>
  );
}