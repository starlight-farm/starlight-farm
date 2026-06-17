import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function PlainYogurtPage() {
  return (
    <main className="min-h-screen bg-[#FFF8EC] text-slate-900">
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
          <p className="mb-4 text-sm font-bold text-amber-700">
            HACCP 인증 · 무항생제 원유
          </p>

          <h1 className="mb-4 text-5xl font-bold leading-tight">
            플레인 요거트
          </h1>

          <p className="mb-6 text-lg leading-relaxed text-slate-600">
            화순에서 자란 무항생제 원유로 만든 진하고 부드러운 별빛목장
            플레인 요거트입니다.
          </p>

          <div className="mb-8 rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm text-slate-500">가볍게 즐기는</p>
                <p className="text-xl font-bold">500ml</p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-pink-300">5,000원</p>
                <p className="text-sm text-yellow-300">⭐ 별 1개 적립</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">가족과 함께</p>
                <p className="text-xl font-bold">1,000ml</p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-300">9,000원</p>
                <p className="text-sm text-yellow-300">⭐⭐ 별 2개 적립</p>
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-amber-50 border border-amber-100 px-4 py-2 text-sm">
              🥛 무항생제 원유
            </span>
            <span className="rounded-full bg-amber-50 border border-amber-100 px-4 py-2 text-sm">
              🏭 HACCP 인증
            </span>
            <span className="rounded-full bg-amber-50 border border-amber-100 px-4 py-2 text-sm">
              🌙 별 적립 가능
            </span>
          </div>

          <a
            href="https://smartstore.naver.com/starlight-farm/products/12843042355?nl-query=%EB%B3%84%EB%B9%9B%EB%AA%A9%EC%9E%A5&nl-ts-pid=jAWewdqpvCwssOj2pzK-184831&NaPm=ct%3Dmqa6pew0%7Cci%3Dd2cfd54e2bad32290c9b8ee37f85a11089358b1c%7Ctr%3Dsls%7Csn%3D12417160%7Chk%3Dc17072ed54c28a573d76fb0f7cc268a2c6db6e67"
            target="_blank"
            className="block rounded-full bg-yellow-400 hover:bg-yellow-300 px-8 py-4 text-center font-bold text-slate-950 hover:bg-pink-300"
          >
            스마트스토어에서 구매하기
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-8 text-4xl font-black text-center">
          제품 정보
        </h2>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-2xl font-black">
              기본 정보
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between border-b pb-3">
                <span className="font-bold">식품유형</span>
                <span>농후발효유</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="font-bold">원유 함량</span>
                <span>96.9%</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="font-bold">보관방법</span>
                <span>냉장보관 (0~10℃)</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="font-bold">소비기한</span>
                <span>제조일로부터 35일</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="font-bold">포장재질</span>
                <span>PET / HDPE</span>
              </div>

              <div className="flex justify-between border-b pb-3">
                <span className="font-bold">제조원</span>
                <span>별빛목장</span>
              </div>

              <div className="flex justify-between">
                <span className="font-bold">고객센터</span>
                <span>061-870-8871</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-2xl font-black">
              원재료
            </h3>

            <div className="space-y-4 text-lg">
              <p>
                🥛 원유 96.9%
                <br />
                <span className="text-sm text-slate-500">
                  (국산, 별빛목장)
                </span>
              </p>

              <p>
                🍬 정백당 3%
              </p>

              <p>
                🦠 유산균
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-8 text-center text-4xl font-black">
          영양정보
        </h2>

        <p className="mb-8 text-center text-slate-500">
          100ml 기준
        </p>

        <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm">
          <div className="grid grid-cols-2 border-b">
            <div className="p-4 font-bold">열량</div>
            <div className="p-4 text-right">77.6 kcal</div>
          </div>

          <div className="grid grid-cols-2 border-b">
            <div className="p-4 font-bold">탄수화물</div>
            <div className="p-4 text-right">8.3 g</div>
          </div>

          <div className="grid grid-cols-2 border-b">
            <div className="p-4 font-bold">당류</div>
            <div className="p-4 text-right">6.6 g</div>
          </div>

          <div className="grid grid-cols-2 border-b">
            <div className="p-4 font-bold">단백질</div>
            <div className="p-4 text-right">3.0 g</div>
          </div>

          <div className="grid grid-cols-2 border-b">
            <div className="p-4 font-bold">지방</div>
            <div className="p-4 text-right">3.6 g</div>
          </div>

          <div className="grid grid-cols-2 border-b">
            <div className="p-4 font-bold">나트륨</div>
            <div className="p-4 text-right">53 mg</div>
          </div>

          <div className="grid grid-cols-2">
            <div className="p-4 font-bold">콜레스테롤</div>
            <div className="p-4 text-right">12.4 mg</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-8 text-center text-4xl font-black">
          별빛목장 플레인 요거트 특징
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {[
            {
              icon: "🥛",
              title: "무항생제 원유",
              desc: "안전하고 깨끗한 원유 사용",
            },
            {
              icon: "🏅",
              title: "체세포수 1등급",
              desc: "건강한 젖소에서 생산",
            },
            {
              icon: "✨",
              title: "세균수 1A등급",
              desc: "위생적으로 관리된 원유",
            },
            {
              icon: "🏭",
              title: "HACCP 인증",
              desc: "안전한 제조시설 생산",
            },
            {
              icon: "🐄",
              title: "목장 직영",
              desc: "원유 생산부터 제조까지",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-amber-100 bg-white p-6 text-center shadow-sm"
            >
              <div className="mb-3 text-4xl">
                {item.icon}
              </div>

              <h3 className="mb-2 font-black">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="mb-8 text-center text-4xl font-black">
            회원 혜택
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white/10 p-6 text-center">
              <div className="mb-3 text-4xl">🥛</div>
              <h3 className="font-black">
                500ml 구매 인증
              </h3>
              <p className="mt-2 text-yellow-300">
                ⭐ 별 1개 적립
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 text-center">
              <div className="mb-3 text-4xl">🍶</div>
              <h3 className="font-black">
                1L 구매 인증
              </h3>
              <p className="mt-2 text-yellow-300">
                ⭐⭐ 별 2개 적립
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-6 text-center">
              <div className="mb-3 text-4xl">🎁</div>
              <h3 className="font-black">
                별 40개 달성
              </h3>
              <p className="mt-2 text-yellow-300">
                요거트 1L 교환
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="mb-4 text-4xl font-black">
          신선한 국내산 원유만 사용하여
        </h2>

        <p className="text-xl text-slate-600">
          정직하고 건강한 요거트를 만듭니다.
        </p>
      </section>

      <Footer />
    </main>
  );
}