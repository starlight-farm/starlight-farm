import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFF8EC] text-slate-900">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-16 text-center">
          <p className="mb-4 text-sm font-bold text-yellow-300">
            Farm to Table
          </p>

          <h1 className="mb-6 text-5xl font-bold">
            별빛목장은 직접 만듭니다
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600">
            별빛목장은 화순에서 자란 젖소의 신선한 원유로
            정성껏 요거트를 만드는 유가공 브랜드입니다.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
            <div className="mb-4 text-5xl">🐄</div>
            <h2 className="mb-3 text-2xl font-bold">직접 키운 젖소</h2>
            <p className="leading-relaxed text-slate-600">
              건강한 목장에서 시작되는 신선한 원유를 소중하게 생각합니다.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
            <div className="mb-4 text-5xl">🥛</div>
            <h2 className="mb-3 text-2xl font-bold">직접 생산한 원유</h2>
            <p className="leading-relaxed text-slate-600">
              목장에서 직접 생산한 원유를 사용해 요거트를 만듭니다.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
            <div className="mb-4 text-5xl">🏭</div>
            <h2 className="mb-3 text-2xl font-bold">직접 만드는 요거트</h2>
            <p className="leading-relaxed text-slate-600">
              HACCP 인증 시설에서 한 병 한 병 정성껏 제조합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-amber-100 bg-white p-10 shadow-sm">
          <h2 className="mb-8 text-center text-3xl font-bold">
            별빛목장의 약속
          </h2>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-center">
              <div className="mb-3 text-3xl">🥛</div>
              <p className="font-bold">무항생제 원유</p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-center">
              <div className="mb-3 text-3xl">🏭</div>
              <p className="font-bold">HACCP 인증</p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-center">
              <div className="mb-3 text-3xl">🌱</div>
              <p className="font-bold">신선한 원료</p>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-center">
              <div className="mb-3 text-3xl">🚚</div>
              <p className="font-bold">신선 배송</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="mb-6 text-4xl font-bold">
          별빛목장의 요거트를 만나보세요
        </h2>

        <p className="mb-8 text-slate-300">
          플레인 요거트와 블루베리 요거트를 제품소개에서 확인할 수 있습니다.
        </p>

        <Link
          href="/products"
          className="inline-block rounded-full bg-yellow-400 px-8 py-4 font-bold text-slate-950 hover:bg-yellow-300"
        >
          제품 보러가기
        </Link>
      </section>

      <Footer />
    </main>
  );
}