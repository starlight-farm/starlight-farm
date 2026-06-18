"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [showBetaPopup, setShowBetaPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginAndPopup = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      const loggedIn = !!user;
      setIsLoggedIn(loggedIn);
  
      const hiddenUntil = localStorage.getItem("betaPopupHide");
  
      if (!hiddenUntil) {
        setShowBetaPopup(true);
        return;
      }
  
      if (Date.now() > Number(hiddenUntil)) {
        setShowBetaPopup(true);
      }
    };
  
    checkLoginAndPopup();
  }, []);

  const closePopup = () => {
    setShowBetaPopup(false);
  
    if (!isLoggedIn) {
      setShowSignupPopup(true);
    }
  };
  const hideToday = () => {
    const sevenDays =
      Date.now() + 1000 * 60 * 60 * 24 * 7;

    localStorage.setItem(
      "betaPopupHide",
      sevenDays.toString()
    );

    setShowBetaPopup(false);

    if (!isLoggedIn) {
      setShowSignupPopup(true);
    }
  };
  return (
    <main className="min-h-screen bg-[#FFF8EC] text-slate-900">
      <Header />
      {showBetaPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">

            <img
              src="/images/byulbit.png"
              alt="별빛이"
              className="mx-auto mb-3 h-20 w-20 object-contain sm:h-28 sm:w-28"
            />

            <p className="mb-2 text-sm font-bold text-amber-700">
              BETA SERVICE
            </p>

            <h2 className="mb-4 text-2xl font-black text-slate-950">
              🌟 별빛목장 베타 홈페이지
            </h2>

            <p className="mb-6 whitespace-pre-line text-sm leading-6 text-slate-600">
              안녕하세요. 별빛목장입니다.

              현재 홈페이지는 베타(Beta) 테스트 기간으로
              기능 개선 및 안정화 작업이 진행 중입니다.

              일부 기능은 변경될 수 있으며
              회원 정보, 별 적립 내역,
              구매 인증 내역 등이 초기화될 수 있습니다.

              더 좋은 서비스를 위해
              지속적으로 개선하고 있습니다.
            </p>

            <div className="sticky bottom-0 flex gap-3 bg-white pt-4">
              <button
                onClick={hideToday}
                className="flex-1 rounded-xl border border-slate-300 py-3 font-bold"
              >
                7일간 보지 않기
              </button>

              <button
                onClick={closePopup}
                className="flex-1 rounded-xl bg-yellow-400 py-3 font-bold text-slate-950"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {showSignupPopup && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
            <button
              onClick={() => setShowSignupPopup(false)}
              className="absolute right-5 top-5 text-2xl font-bold text-slate-400 hover:text-slate-900"
            >
              ×
            </button>

            <img
              src="/images/byulbit.png"
              alt="별빛이"
              className="mx-auto mb-3 h-20 w-20 object-contain sm:h-28 sm:w-28"
            />

            <p className="mb-2 text-sm font-bold text-amber-700">
              별빛목장 회원 혜택
            </p>

            <h2 className="mb-4 text-2xl font-black text-slate-950">
              별을 모으려면 회원가입이 필요해요!
            </h2>
            <div className="mb-5 rounded-2xl border border-yellow-300 bg-yellow-50 p-4">
              <p className="text-sm font-bold text-amber-700">
                🎉 오픈 기념 이벤트
              </p>

              <p className="mt-2 text-lg font-black text-slate-950 sm:text-xl">
                선착순 회원 50명까지
                <br />
                회원가입 시 별 20개 적립!
              </p>

              <p className="mt-2 text-xs text-slate-500">
                적립된 별은 마이페이지의 나만의 밤하늘에서 확인할 수 있어요.
              </p>
            </div>
            <p className="mb-6 text-sm leading-6 text-slate-600">
              스마트스토어 구매 후 인증하면 별이 적립됩니다.
              <br />
              500ml는 별 1개, 1L는 별 2개가 쌓이고,
              <br />
              별 40개를 모으면 요거트 1L로 교환할 수 있어요.
            </p>

            <div className="mb-4 grid gap-2 text-left text-sm">
              <div className="rounded-xl bg-yellow-50 p-3 font-bold text-slate-800">
                🥛 500ml 구매 인증 시 별 1개 적립
              </div>

              <div className="rounded-xl bg-yellow-50 p-3 font-bold text-slate-800">
                🍶 1L 구매 인증 시 별 2개 적립
              </div>

              <div className="rounded-xl bg-yellow-50 p-3 font-bold text-slate-800">
                🌙 적립한 별로 나만의 밤하늘 꾸미기
              </div>

              <div className="rounded-xl bg-yellow-50 p-3 font-bold text-slate-800">
                🎁 별 40개로 요거트 1L 교환
              </div>
            </div>

            <div className="sticky bottom-0 flex gap-3 bg-white pt-4">
              <button
                onClick={() => setShowSignupPopup(false)}
                className="flex-1 rounded-xl border border-slate-300 py-3 font-bold text-slate-700"
              >
                나중에 하기
              </button>

              <Link
                href="/signup"
                className="flex-1 rounded-xl bg-yellow-400 py-3 font-bold text-slate-950 hover:bg-yellow-300"
              >
                회원가입 하기
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <div className="mb-4 inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-amber-700">
              🐄 화순 목장에서 직접 생산
            </div>

            <h1 className="mb-5 max-w-2xl text-3xl font-black leading-[1.18] tracking-[-0.04em] text-slate-950 sm:text-4xl md:text-5xl lg:text-6xl">
            화순 목장에서 만든
            <br />
            <span className="text-amber-700">
              무항생제 원유
            </span>
            <br />
            <span className="text-amber-700">
              요거트
            </span>
            </h1>

            <p className="mb-6 max-w-xl text-sm leading-7 text-slate-700 sm:text-base md:text-lg md:leading-8">
              별빛목장은 화순 목장에서 직접 생산한 신선한 원유를 사용합니다.
              <br className="hidden md:block" />
              HACCP인증 시설에서 정성껏 발효해 풍미있는 요거트로 만듭니다.
            </p>

            <div className="mb-8 grid max-w-2xl grid-cols-1 gap-0 overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm sm:grid-cols-2 md:grid-cols-4">
              <div className="border-b border-r border-amber-100 p-4 md:border-b-0">
                <div className="mb-1 text-xl">🐄</div>
                <p className="text-sm font-black text-slate-900">
                  목장 직접 생산
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  신선한 원유 사용
                </p>
              </div>

              <div className="border-b border-amber-100 p-4 md:border-b-0 md:border-r">
                <div className="mb-1 text-xl">🥛</div>
                <p className="text-sm font-black text-slate-900">
                  무항생제 원유
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  안심하고 먹는 원유
                </p>
              </div>

              <div className="border-r border-amber-100 p-4">
                <div className="mb-1 text-xl">🏭</div>
                <p className="text-sm font-black text-slate-900">
                  HACCP 인증
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  위생적인 제조시설
                </p>
              </div>

              <div className="p-4">
                <div className="mb-1 text-xl">🚚</div>
                <p className="text-sm font-black text-slate-900">
                  신선 배송
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  신선하게 집 앞까지
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 flex gap-3 bg-white pt-4">
              <a
                href="https://smartstore.naver.com/starlight-farm"
                target="_blank"
                className="rounded-full bg-yellow-400 px-8 py-4 font-bold"
              >
                바로 구매하기
              </a>

              <a
                href="#products"
                className="rounded-full border bg-white px-8 py-4 font-bold"
              >
                제품 보기
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-yellow-200/40 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] bg-white p-3 shadow-2xl">
              <img
                src="/images/main-yogurt.jpg"
                alt="별빛목장 요거트"
                className="h-72 w-full rounded-[1.5rem] object-cover sm:h-80 md:h-[420px]"
              />

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-5 shadow-lg backdrop-blur">
                <p className="text-sm font-bold text-amber-700">
                  오늘 만든 신선한 요거트
                </p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  목장에서 식탁까지 정직하게
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-4 text-center text-4xl font-black">
        별빛목장은 이렇게 만듭니다
      </h2>

      <p className="mb-10 text-center text-slate-600">
        원유 준비부터 발효, 보관, 배송까지 신선함을 지키는 과정을 담았습니다.
      </p>

        <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            icon: "🥛",
            title: "원유 준비",
            desc: "화순 목장에서 생산한\n신선한 원유를 사용합니다.",
          },
          {
            icon: "🔥",
            title: "살균 발효",
            desc: "HACCP 인증 시설에서\n정성껏 발효합니다.",
          },
          {
            icon: "❄️",
            title: "냉장 보관",
            desc: "완성된 요거트의 신선함을\n차갑게 유지합니다.",
          },
          {
            icon: "🚚",
            title: "신선 배송",
            desc: "꼼꼼하게 포장하여\n안전하게 배송합니다.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-amber-100 bg-white p-7 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-4 text-4xl">{item.icon}</div>
            <h3 className="mb-3 min-h-[56px] text-lg font-black flex items-center justify-center">
              {item.title}
            </h3>
            <p className="min-h-[72px] whitespace-pre-line text-sm leading-6 text-slate-500">
              {item.desc}
            </p>
          </div>
        ))}
        </div>
      </section>

            {/* PRODUCTS */}
            <section id="products" className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-3 text-center text-sm font-bold text-amber-700">
          구매 인증 시 별 적립
        </p>

        <h2 className="mb-4 text-center text-4xl font-black">대표 제품</h2>

        <p className="mb-10 text-center text-slate-600">
          500ml는 별 1개, 1L는 별 2개가 적립됩니다.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <img
              src="/images/plain-yogurt.jpg"
              alt="플레인 요거트"
              className="h-72 w-full bg-white object-contain p-4"
            />

            <div className="p-7">
              <div className="mb-3 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-amber-700">
                ⭐ 500ml / 1L 구매 인증 시 별 적립
              </div>

              <h3 className="mb-3 text-2xl font-black">플레인 요거트</h3>

              <p className="mb-5 text-slate-500">
                무항생제 원유의 진한 풍미를 그대로 담은 기본 요거트입니다.
              </p>

              <div className="mb-6 grid gap-3">
                <div className="rounded-2xl border border-amber-100 bg-[#FFF8EC] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black">500ml</span>
                    <span className="text-xl font-black">5,000원</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-amber-700">
                    ⭐ 구매 인증 시 별 1개 적립
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-[#FFF8EC] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black">1,000ml</span>
                    <span className="text-xl font-black">9,000원</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-amber-700">
                    ⭐ 구매 인증 시 별 2개 적립
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <Link
                  href="/products/plain"
                  className="rounded-xl bg-yellow-400 py-3 text-center font-black text-slate-950 hover:bg-yellow-300"
                >
                  제품 자세히 보기
                </Link>

                <a
                  href="https://smartstore.naver.com/starlight-farm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-300 bg-white py-3 text-center font-bold text-slate-900 hover:bg-slate-50"
                >
                  스마트스토어 구매
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <img
              src="/images/blueberry-yogurt.jpg"
              alt="블루베리 요거트"
              className="h-72 w-full bg-white object-contain p-4"
            />

            <div className="p-7">
              <div className="mb-3 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-amber-700">
                ⭐ 500ml / 1L 구매 인증 시 별 적립
              </div>

              <h3 className="mb-3 text-2xl font-black">블루베리 요거트</h3>

              <p className="mb-5 text-slate-500">
                무항생제 원유와 달콤한 블루베리의 풍미를 담은 블루베리 요거트입니다.
              </p>

              <div className="mb-6 grid gap-3">
                <div className="rounded-2xl border border-amber-100 bg-[#FFF8EC] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black">500ml</span>
                    <span className="text-xl font-black">6,000원</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-amber-700">
                    ⭐ 구매 인증 시 별 1개 적립
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-[#FFF8EC] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-black">1,000ml</span>
                    <span className="text-xl font-black">10,000원</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-amber-700">
                    ⭐ 구매 인증 시 별 2개 적립
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                <Link
                  href="/products/blueberry"
                  className="rounded-xl bg-yellow-400 py-3 text-center font-black text-slate-950 hover:bg-yellow-300"
                >
                  제품 자세히 보기
                </Link>

                <a
                  href="https://smartstore.naver.com/starlight-farm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-300 bg-white py-3 text-center font-bold text-slate-900 hover:bg-slate-50"
                >
                  스마트스토어 구매
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REWARD */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-bold text-yellow-300">
              별빛목장 회원 혜택
            </p>

            <h2 className="mb-5 text-4xl font-black leading-tight">
              요거트를 먹으면
              <br />
              나만의 밤하늘이 자랍니다
            </h2>

            <p className="mb-8 leading-relaxed text-slate-300">
              스마트스토어 구매 후 인증하면 별이 적립됩니다.
              별을 모아 나만의 별자리를 만들고,
              별 40개를 모으면 요거트 1L로 교환할 수 있어요.
            </p>

            <div className="grid gap-3">
              <div className="rounded-2xl bg-white/10 p-5">
                🥛 500ml 구매 인증 시 별 1개
              </div>
              <div className="rounded-2xl bg-white/10 p-5">
                🍶 1L 구매 인증 시 별 2개
              </div>
              <div className="rounded-2xl bg-white/10 p-5">
                🎁 별 40개로 요거트 1L 교환
              </div>
            </div>
          </div>

          <div className="relative h-72 overflow-hidden rounded-3xl border border-blue-300/30 bg-[#020617] shadow-[0_0_40px_rgba(59,130,246,0.25)] sm:h-80">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.25),transparent_40%)]" />

            <div className="absolute left-6 top-6 text-4xl">🌙</div>

            {/* 별자리 선 */}
            <svg className="absolute inset-0 h-full w-full">
              <line x1="22%" y1="42%" x2="32%" y2="34%" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
              <line x1="32%" y1="34%" x2="44%" y2="41%" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
              <line x1="44%" y1="41%" x2="55%" y2="34%" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />
              <line x1="55%" y1="34%" x2="68%" y2="42%" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />

              <line x1="44%" y1="41%" x2="36%" y2="55%" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3" />
              <line x1="55%" y1="34%" x2="62%" y2="55%" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3" />

              <line x1="36%" y1="55%" x2="25%" y2="65%" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3" />
              <line x1="62%" y1="55%" x2="75%" y2="65%" stroke="rgba(255,255,255,0.45)" strokeWidth="1.3" />
            </svg>

            {/* 별들 */}
            {[
              { top: 42, left: 22 },
              { top: 34, left: 32 },
              { top: 41, left: 44 },
              { top: 34, left: 55 },
              { top: 42, left: 68 },
              { top: 55, left: 36 },
              { top: 55, left: 62 },
              { top: 65, left: 25 },
              { top: 65, left: 75 },
            ].map((star, index) => (
              <span
                key={index}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-lg drop-shadow-[0_0_12px_rgba(250,204,21,1)]"
                style={{
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                }}
              >
                ⭐
              </span>
            ))}

            {/* 작은 배경 별 */}
            <div className="absolute left-[18%] top-[22%] h-1 w-1 rounded-full bg-white shadow-[0_0_8px_white]" />
            <div className="absolute left-[80%] top-[28%] h-1 w-1 rounded-full bg-blue-100 shadow-[0_0_8px_rgba(191,219,254,1)]" />
            <div className="absolute left-[47%] top-[22%] h-1 w-1 rounded-full bg-yellow-100 shadow-[0_0_8px_rgba(254,240,138,1)]" />

            <div className="absolute bottom-5 left-4 rounded-full border border-yellow-300/40 bg-yellow-300/10 px-3 py-2 text-xs font-bold text-yellow-100 sm:left-5 sm:px-4 sm:text-sm">
              ♓ 물고기자리
            </div>

            <Link
              href="/mypage"
              className="absolute bottom-5 right-4 rounded-full bg-yellow-400 px-3 py-2 text-xs font-black text-slate-950 hover:bg-yellow-300 sm:right-5 sm:px-4 sm:text-sm"
            >
              밤하늘 보기
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="mb-4 text-4xl font-black">
          오늘 만든 요거트가
          <br />
          내일 당신의 식탁으로 갑니다
        </h2>

        <p className="mx-auto mb-8 max-w-2xl text-slate-600">
          화순 목장에서 직접 생산한 원유로 만든 별빛목장 요거트를
          지금 스마트스토어에서 만나보세요.
        </p>

        <a
          href="https://smartstore.naver.com/starlight-farm"
          target="_blank"
          className="mt-6 inline-block rounded-full bg-yellow-400 px-8 py-4 font-bold"
        >
          스마트스토어 바로가기
        </a>
      </section>

      <Footer />
    </main>
  );
}
