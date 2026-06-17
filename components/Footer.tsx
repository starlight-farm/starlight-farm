import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <div className="grid gap-10 md:grid-cols-3">

          <div>
            <h3 className="mb-3 text-xl font-bold text-white">
              🌙 별빛목장
            </h3>

            <p className="text-slate-400">
              무항생제 원유로 만드는 프리미엄 수제 요거트
            </p>

            <p className="mt-2 text-slate-500">
              화순에서 직접 생산한 원유로 정성껏 만듭니다.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-white">
              바로가기
            </h4>

            <div className="space-y-2 text-slate-400">

              <Link
                href="/products"
                className="block hover:text-yellow-300"
              >
                제품소개
              </Link>

              <Link
                href="/about"
                className="block hover:text-yellow-300"
              >
                목장소개
              </Link>

              <Link
                href="/notice"
                className="block hover:text-yellow-300"
              >
                공지사항
              </Link>

              <Link
                href="/mypage"
                className="block hover:text-yellow-300"
              >
                나의 밤하늘
              </Link>

            </div>
          </div>

          <div>
            <h4 className="mb-3 font-bold text-white">
              사업자 정보
            </h4>

            <div className="space-y-2 text-slate-400">
              <p>상호명 : 별빛목장</p>
              <p>대표자 : 최윤석</p>
              <p>사업자등록번호 : 599-20-02336</p>
              <p>전화 : 061-870-8871</p>
              <p>
                주소 : 전라남도 화순군 동면 동농공길 134
              </p>
            </div>
          </div>

        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
          © 2026 별빛목장. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
}