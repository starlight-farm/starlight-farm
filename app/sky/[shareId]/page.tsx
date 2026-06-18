import { supabase } from "../../../lib/supabase";

export default async function SharedSkyPage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;

  const { data: sky, error } = await supabase
    .from("user_sky")
    .select(
      "positions, connections, share_id, is_public, sky_name, updated_at, star_count, royal_star_count"
    )
    .eq("share_id", shareId)
    .eq("is_public", true)
    .maybeSingle();

  if (error || !sky) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="mb-4 text-5xl">🌙</div>
          <h1 className="text-2xl font-bold">
            공유된 밤하늘을 찾을 수 없어요.
          </h1>
          <p className="mt-4 text-sm text-slate-400">
            shareId: {shareId}
          </p>
        </div>
      </main>
    );
  }

  const positions = sky.positions || {};
  const connections = sky.connections || [];
  const starCount = sky.star_count || Object.keys(positions).length;

  const getDefaultPositionByKey = (key: string) => {
    if (key.startsWith("small-")) {
      const index = Number(key.replace("small-", ""));
      return {
        top: ((index * 37) % 88) + 6,
        left: ((index * 53) % 88) + 6,
      };
    }

    if (key.startsWith("royal-")) {
      const index = Number(key.replace("royal-", ""));
      return {
        top: ((index * 29) % 76) + 10,
        left: ((index * 41) % 76) + 10,
      };
    }

    return { top: 50, left: 50 };
  };

  const getPositionByKey = (key: string) => {
    return positions[key] || getDefaultPositionByKey(key);
  };

  const allKeys = Array.from(
    new Set([
      ...Object.keys(positions),
      ...connections.map((line: any) => line.from),
      ...connections.map((line: any) => line.to),
    ])
  );

  const smallKeys = allKeys.filter((key) => key.startsWith("small-"));
  const royalKeys = allKeys.filter((key) => key.startsWith("royal-"));

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
        <div className="mb-4 text-5xl">🌙</div>

        {sky.sky_name && (
          <div className="mb-4">
            <p className="text-sm uppercase tracking-[0.3em] text-yellow-300">
              STAR CONSTELLATION
            </p>

            <h1 className="mt-2 text-4xl font-black text-yellow-300">
              ✨ {sky.sky_name} ✨
            </h1>
          </div>
        )}
         
        <div className="mb-4 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300">
          <span>⭐ 보유 별 {starCount}개</span>

          <span>
            📅 최근 수정{" "}
            {new Date(sky.updated_at).toLocaleDateString("ko-KR")}
          </span>
        </div>

        <p className="mb-8 text-slate-300">
          별빛목장 회원이 만든 나만의 별자리예요.
        </p>

        <div className="relative h-96 overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
          <svg className="absolute inset-0 h-full w-full pointer-events-none">
            {connections.map((line: any, index: number) => {
              const from = getPositionByKey(line.from);
              const to = getPositionByKey(line.to);

              return (
                <line
                  key={index}
                  x1={`${from.left}%`}
                  y1={`${from.top}%`}
                  x2={`${to.left}%`}
                  y2={`${to.top}%`}
                  stroke="rgba(255,255,255,0.65)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          <div className="absolute left-6 top-6 text-4xl">🌙</div>

          {smallKeys.map((key) => {
            const position = getPositionByKey(key);

            return (
              <span
                key={key}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-sm drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]"
                style={{
                  top: `${position.top}%`,
                  left: `${position.left}%`,
                }}
              >
                ⭐
              </span>
            );
          })}

          {royalKeys.map((key) => {
            const position = getPositionByKey(key);

            return (
              <span
                key={key}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-red-500 drop-shadow-[0_0_14px_rgba(239,68,68,0.95)]"
                style={{
                  top: `${position.top}%`,
                  left: `${position.left}%`,
                }}
              >
                ★
              </span>
            );
          })}
        </div>
      </div>
    </main>
  );
}