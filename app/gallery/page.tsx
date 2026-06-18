import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";

export default async function GalleryPage() {
  const { data: skies, error } = await supabase
    .from("user_sky")
    .select("sky_name, share_id, updated_at")
    .eq("is_gallery_public", true)
    .not("sky_name", "is", null)
    .order("updated_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#FFF8EC] text-slate-900">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-3 text-center text-sm font-bold text-amber-700">
          STAR GALLERY
        </p>

        <h1 className="mb-4 text-center text-4xl font-black sm:text-5xl">
          별빛목장 전시관
        </h1>

        <p className="mb-12 text-center text-slate-600">
          별빛목장 회원들이 직접 만든 공개 별자리입니다.
        </p>

        {error ? (
          <div className="rounded-3xl border border-red-100 bg-white p-10 text-center text-red-500 shadow-sm">
            전시관을 불러오지 못했습니다.
          </div>
        ) : !skies || skies.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            아직 공개된 별자리가 없어요.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skies.map((sky) => (
              <Link
                key={sky.share_id}
                href={`/sky/${sky.share_id}`}
                className="group rounded-3xl border border-amber-100 bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 text-5xl">🌙</div>

                <p className="mb-2 text-xs font-bold tracking-[0.25em] text-amber-700">
                  CONSTELLATION
                </p>

                <h2 className="mb-3 text-xl font-black text-slate-950 group-hover:text-amber-700">
                  ✨ {sky.sky_name}
                </h2>

                <p className="text-sm text-slate-500">
                  공유된 별자리 보기
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block rounded-full border border-slate-300 bg-white px-6 py-3 font-bold text-slate-900 hover:bg-slate-50"
          >
            메인으로 돌아가기
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}