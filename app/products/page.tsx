import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function ProductsPage() {
  const products = [
    {
      name: "플레인 요거트",
      image: "/images/plain-yogurt.jpg",
      href: "/products/plain",
      desc: "무항생제 원유로 만든 진하고 부드러운 플레인 요거트입니다.",
      options: [
        { size: "500ml", price: "5,000원", stars: "별 1개 적립" },
        { size: "1,000ml", price: "9,000원", stars: "별 2개 적립" },
      ],
    },
    {
      name: "블루베리 요거트",
      image: "/images/blueberry-yogurt.jpg",
      href: "/products/blueberry",
      desc: "블루베리 과육이 들어간 달콤하고 부드러운 수제 요거트입니다.",
      options: [
        { size: "500ml", price: "5,500원", stars: "별 1개 적립" },
        { size: "1,000ml", price: "10,000원", stars: "별 2개 적립" },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#FFF8EC] text-slate-900">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-14 text-center">
          <p className="mb-4 text-sm font-bold text-amber-700">
            HACCP 인증 · 무항생제 원유 · 목장 직접 생산
          </p>

          <h1 className="mb-5 text-5xl font-black text-slate-950">
            별빛목장 요거트
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600">
            목장에서 직접 생산한 신선한 원유로 만든 별빛목장의 대표 제품입니다.
            500ml와 1L 제품 모두 구매 인증 시 별이 적립됩니다.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="rounded-full border border-amber-100 bg-white px-4 py-2 text-sm font-bold shadow-sm">
              🥛 500ml 별 1개
            </span>
            <span className="rounded-full border border-amber-100 bg-white px-4 py-2 text-sm font-bold shadow-sm">
              🍶 1L 별 2개
            </span>
            <span className="rounded-full border border-amber-100 bg-white px-4 py-2 text-sm font-bold shadow-sm">
              🎁 별 40개 무료교환
            </span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {products.map((product) => (
            <div
              key={product.name}
              className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-72 w-full object-cover sm:h-80 md:h-96"
              />

              <div className="p-7">
                <h2 className="mb-3 text-3xl font-black">{product.name}</h2>

                <p className="mb-6 leading-relaxed text-slate-500">
                  {product.desc}
                </p>

                <div className="mb-6 grid gap-3">
                  {product.options.map((option) => (
                    <div
                      key={option.size}
                      className="rounded-2xl border border-amber-100 bg-[#FFF8EC] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="text-sm font-black text-slate-700">
                          {option.size}
                        </span>
                        <span className="text-2xl font-black text-slate-950">
                          {option.price}
                        </span>
                      </div>

                      <div className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-amber-700">
                        ⭐ 구매 인증 시 {option.stars}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-3">
                  <Link
                    href={product.href}
                    className="block rounded-xl bg-yellow-400 py-4 text-center font-black text-slate-950 hover:bg-yellow-300"
                  >
                    제품 자세히 보기
                  </Link>

                  <a
                    href="https://smartstore.naver.com/starlight-farm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl border border-slate-300 bg-white py-4 text-center font-bold text-slate-900 hover:bg-slate-50"
                  >
                    스마트스토어 구매
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
