"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setEmail(user?.email ?? null);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <header className="w-full border-b border-white/10 bg-slate-950/90 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-5">
        <Link href="/" className="text-2xl font-bold">
          🌙 별빛목장
        </Link>

        {/* PC 메뉴 */}
        <nav className="hidden items-center gap-5 text-sm font-bold text-white lg:flex">
          <Link href="/">홈</Link>
          <Link href="/products">제품소개</Link>
          <Link href="/about">목장소개</Link>
          <Link href="/notice">공지사항</Link>

          {email ? (
            <>
              <Link
                href="/mypage"
                className="text-yellow-300 hover:text-yellow-200"
              >
                🌙 나의 밤하늘
              </Link>

              <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-yellow-300">
                {email.split("@")[0]}님
              </span>

              <button
                onClick={logout}
                className="rounded-lg bg-red-500 px-3 py-1 text-white hover:bg-red-400"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login">로그인</Link>
              <Link href="/signup">회원가입</Link>
            </>
          )}
        </nav>

        {/* 모바일 버튼 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-3xl lg:hidden"
        >
          ☰
        </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-slate-950 lg:hidden">
            <div className="flex flex-col gap-4 p-5 text-white">

              <Link href="/" onClick={() => setMenuOpen(false)}>
                홈
              </Link>

              <Link href="/products" onClick={() => setMenuOpen(false)}>
                제품소개
              </Link>

              <Link href="/about" onClick={() => setMenuOpen(false)}>
                목장소개
              </Link>

              <Link href="/notice" onClick={() => setMenuOpen(false)}>
                공지사항
              </Link>

              {email ? (
                <>
                  <Link
                    href="/mypage"
                    onClick={() => setMenuOpen(false)}
                    className="text-yellow-300"
                  >
                    🌙 나의 밤하늘
                  </Link>

                  <button
                    onClick={logout}
                    className="rounded-lg bg-red-500 py-2"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">로그인</Link>
                  <Link href="/signup">회원가입</Link>
                </>
              )}
            </div>
          </div>
        )}

        </header>
  );
}