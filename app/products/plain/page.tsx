import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function PlainYogurtPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <img
            src="/images/plain-yogurt.jpg"
            alt="별빛목장 플레인 요거트"
            className="w-full rounded-3xl shadow-2xl"
          />
        </div>

        <div>
          <p className="mb-4 text-sm font-bold text-yellow-300">
            HACCP 인증 · 무항생제 원유
          </p>

          <h1 className="mb-4 text-5xl font-bold leading-tight">
            플레인 요거트
          </h1>

          <p className="mb-6 text-lg leading-relaxed text-slate-300">
            화순에서 자란 무항생제 원유로 만든 진하고 부드러운 별빛목장
            플레인 요거트입니다.
          </p>

          <div className="mb-8 rounded-3xl border border-pink-400/20 bg-white/5 p-8">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-slate-400">가볍게 즐기는</p>
                <p className="text-xl font-bold">500ml</p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-pink-300">5,000원</p>
                <p className="text-sm text-yellow-300">⭐ 별 1개 적립</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">가족과 함께</p>
                <p className="text-xl font-bold">1,000ml</p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-300">9,000원</p>
                <p className="text-sm text-yellow-300">⭐⭐ 별 2개 적립</p>
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
              🥛 무항생제 원유
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
              🏭 HACCP 인증
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
              🌙 별 적립 가능
            </span>
          </div>

          <a
            href="https://smartstore.naver.com/starlight-farm/products/12843042355?nl-query=%EB%B3%84%EB%B9%9B%EB%AA%A9%EC%9E%A5&nl-ts-pid=jAWewdqpvCwssOj2pzK-184831&NaPm=ct%3Dmqa6pew0%7Cci%3Dd2cfd54e2bad32290c9b8ee37f85a11089358b1c%7Ctr%3Dsls%7Csn%3D12417160%7Chk%3Dc17072ed54c28a573d76fb0f7cc268a2c6db6e67"
            target="_blank"
            className="block rounded-full bg-pink-400 px-8 py-4 text-center font-bold text-slate-950 hover:bg-pink-300"
          >
            스마트스토어에서 구매하기
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-8 text-3xl font-bold">제품 정보</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white/5 p-8">
            <div className="mb-4 text-4xl">🐄</div>
            <h3 className="mb-3 text-xl font-bold">직접 생산한 원유</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              목장에서 직접 생산한 신선한 원유를 사용합니다.
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 p-8">
            <div className="mb-4 text-4xl">🥣</div>
            <h3 className="mb-3 text-xl font-bold">진하고 부드러운 맛</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              담백하고 부드러운 플레인 요거트 본연의 맛을 느낄 수 있습니다.
            </p>
          </div>

          <div className="rounded-3xl bg-white/5 p-8">
            <div className="mb-4 text-4xl">🚚</div>
            <h3 className="mb-3 text-xl font-bold">신선 배송</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              냉장 상태로 신선하게 배송됩니다.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}