import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFF8EC] text-slate-900">
      <Header />

      {/* HERO */}
      <section className="relative">
        <img
          src="/images/farm-building.jpg"
          alt="별빛목장"
          className="h-[500px] w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="px-6 text-center text-white">
            <p className="mb-4 text-lg font-bold text-yellow-300">
              Farm to Table
            </p>

            <h1 className="mb-6 text-5xl font-black md:text-7xl">
              별빛목장 이야기
            </h1>

            <p className="text-lg md:text-2xl">
              건강한 젖소, 신선한 원유,
              <br />
              그리고 정직한 요거트
            </p>
          </div>
        </div>
      </section>

      {/* 착유 */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <img
            src="/images/farm-milking.jpg"
            alt="착유"
            className="rounded-3xl shadow-xl"
          />

          <div>
            <p className="mb-3 font-bold text-amber-600">
              원유 생산
            </p>

            <h2 className="mb-6 text-4xl font-black">
              직접 키우고,
              <br />
              직접 생산합니다
            </h2>

            <p className="text-lg leading-relaxed text-slate-600">
              별빛목장은 건강하게 관리된 젖소로부터
              매일 신선한 원유를 생산합니다.
              <br />
              <br />
              좋은 요거트의 시작은 좋은 원유라고 믿습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 젖소 */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">

          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-black">
              건강한 젖소
            </h2>

            <p className="text-slate-600">
              건강한 젖소가 건강한 원유를 만듭니다.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <img
              src="/images/barn.jpg"
              alt="우사"
              className="rounded-3xl shadow-lg"
            />

            <img
              src="/images/cow-rest.jpg"
              alt="젖소"
              className="rounded-3xl shadow-lg"
            />
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-amber-50 p-6 text-center">
            <h3 className="mb-2 font-bold">
              무항생제 원유
            </h3>

            <p className="text-sm text-slate-600">
              깨끗하게 관리된 젖소에서 생산된 원유
            </p>
            </div>

            <div className="rounded-3xl bg-amber-50 p-6 text-center">
              <h3 className="font-bold">
                체세포수 1등급
              </h3>
            </div>

            <div className="rounded-3xl bg-amber-50 p-6 text-center">
              <h3 className="font-bold">
                세균수 1A등급
              </h3>
            </div>
          </div>

        </div>
      </section>

      {/* 송아지 */}
      <section className="mx-auto max-w-6xl px-6 py-24">

      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-black">
          송아지 이야기
        </h2>

        <p className="text-slate-600">
          건강한 미래는 건강한 송아지에서 시작됩니다.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <img
          src="/images/calf-feed.jpg"
          alt="송아지 급여"
          className="h-[420px] w-full rounded-3xl object-cover shadow-lg lg:h-[560px]"
        />

        <div className="grid gap-8">
          <img
            src="/images/calf-face.jpg"
            alt="송아지 얼굴"
            className="h-[240px] w-full rounded-3xl object-cover shadow-lg lg:h-[264px]"
          />

          <img
            src="/images/calf-run.jpg"
            alt="송아지"
            className="h-[240px] w-full rounded-3xl object-cover shadow-lg lg:h-[264px]"
          />
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg">

        <p className="mb-6 text-center text-lg leading-relaxed text-slate-600">
          태어난 송아지는 충분한 초유 급여와
          개별 관리를 통해 건강하게 성장합니다.
          <br />
          <br />
          별빛목장은 젖소의 건강뿐 아니라
          송아지의 성장 과정까지 세심하게 관리하며,
          건강한 미래를 준비합니다.
        </p>

        <div className="grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl bg-amber-50 p-5 text-center">
            <div className="mb-2 text-3xl">🍼</div>
            <h3 className="font-bold">개별 급여 관리</h3>
          </div>

          <div className="rounded-2xl bg-amber-50 p-5 text-center">
            <div className="mb-2 text-3xl">🌱</div>
            <h3 className="font-bold">건강한 성장</h3>
          </div>

          <div className="rounded-2xl bg-amber-50 p-5 text-center">
            <div className="mb-2 text-3xl">🐄</div>
            <h3 className="font-bold">미래의 젖소</h3>
          </div>

        </div>

      </div>

      </section>

      {/* 생산시설 */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">

          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-black">
              HACCP 생산시설
            </h2>

            <p className="text-slate-600">
              원유 생산부터 제조까지 직접 관리합니다.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">

            <div>
              <img
                src="/images/filling.jpg"
                alt="자동 충진"
                className="h-72 w-full rounded-3xl object-cover shadow-lg"
              />

              <h3 className="mt-4 text-center text-lg font-bold">
                자동 충진 시스템
              </h3>

              <p className="mt-2 text-center text-sm text-slate-600">
                일정한 품질과 위생을 위해 자동 충진 설비 운영
              </p>
            </div>

            <div>
              <img
                src="/images/factory.jpg"
                alt="HACCP 생산시설"
                className="h-72 w-full rounded-3xl object-cover shadow-lg"
              />

              <h3 className="mt-4 text-center text-lg font-bold">
                HACCP 인증 생산시설
              </h3>

              <p className="mt-2 text-center text-sm text-slate-600">
                원유 입고부터 제조까지 철저한 위생관리 기준 적용
              </p>
            </div>

            <div>
              <img
                src="/images/production.jpg"
                alt="생산 공정"
                className="h-72 w-full rounded-3xl object-cover shadow-lg"
              />

              <h3 className="mt-4 text-center text-lg font-bold">
                위생적인 생산 공정
              </h3>

              <p className="mt-2 text-center text-sm text-slate-600">
                깨끗한 작업환경에서 안전하게 요거트 생산
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 대표 인사 */}
      <section className="mx-auto max-w-5xl px-6 py-24">

        <div className="grid items-center gap-16 lg:grid-cols-[47%_53%]">

          <img
            src="/images/ceo.jpg"
            alt="대표"
            className="h-[420px] w-full rounded-3xl object-cover shadow-xl"
          />

          <div>
          <div>
            <h2 className="mb-8 text-4xl font-black">
              별빛목장의 약속
            </h2>

            <div className="flex flex-col justify-center text-lg leading-8 text-slate-700">
              <p>
                안녕하세요.<br />
                별빛목장 대표입니다.
              </p>

              <p className="mt-6">
                별빛목장은 건강한 젖소를 직접 키우고,<br />
                신선한 원유로 정직한 요거트를 만드는 목장입니다.
              </p>

              <p className="mt-6">
                좋은 요거트는 좋은 원유에서 시작된다고 믿습니다.<br />
                그래서 젖소 관리부터 착유, 생산, 포장까지<br />
                모든 과정을 직접 살피고 있습니다.
              </p>

              <p className="mt-6">
                가족이 먹는다는 마음으로 깨끗하게 만들고,<br />
                고객 여러분께 믿고 드실 수 있는 요거트를<br />
                전해드리겠습니다.
              </p>

              <p className="mt-6 font-bold text-slate-900">
                감사합니다.
              </p>
            </div>
          </div>
          </div>

        </div>

      </section>

      {/* CTA */}
      <section className="pb-24 text-center">

        <h2 className="mb-6 text-4xl font-black">
          별빛목장의 요거트를 만나보세요
        </h2>

        <p className="mb-8 text-slate-600">
          건강한 원유로 만든
          별빛목장 요거트를 만나보세요.
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