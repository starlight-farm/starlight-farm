"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";

export default function NoticePage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [noticeImages, setNoticeImages] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadNotices = async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("id, title, content, image_url, created_at, view_count")
      .order("created_at", { ascending: false });

    if (error) {
      alert("공지사항을 불러오지 못했습니다: " + error.message);
      setLoading(false);
      return;
    }

    setNotices(data ?? []);
    setLoading(false);
  };

  const loadNoticeImages = async () => {
    const { data, error } = await supabase
      .from("notice_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      alert("공지 이미지 불러오기 실패: " + error.message);
      return;
    }

    const grouped: Record<number, any[]> = {};

    (data ?? []).forEach((item) => {
      const noticeId = Number(item.notice_id);

      if (!grouped[noticeId]) {
        grouped[noticeId] = [];
      }

      grouped[noticeId].push(item);
    });

    setNoticeImages(grouped);
  };

  const increaseViewCount = async (
    noticeId: number,
    currentCount: number
  ) => {
    await supabase
      .from("notices")
      .update({
        view_count: (currentCount ?? 0) + 1,
      })
      .eq("id", noticeId);
  
    setNotices((prev) =>
      prev.map((item) =>
        item.id === noticeId
          ? {
              ...item,
              view_count: (item.view_count ?? 0) + 1,
            }
          : item
      )
    );
  };

  useEffect(() => {
    loadNotices();
    loadNoticeImages();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8EC] text-slate-900">
      <Header />

      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-bold text-amber-700">
            Notice
          </p>

          <h1 className="mb-4 text-4xl font-black sm:text-5xl">
            별빛목장 소식
          </h1>

          <p className="text-sm leading-7 text-slate-600 sm:text-base">
            배송 안내, 이벤트, 생산 소식 등<br className="sm:hidden" />
            별빛목장의 새로운 소식을 확인하세요.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">
            공지사항을 불러오는 중입니다...
          </p>
        ) : notices.length === 0 ? (
          <div className="rounded-3xl border border-amber-100 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">등록된 공지사항이 없습니다.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-sm">
            {notices.map((notice, index) => {
              const isOpen = openId === notice.id;

              return (
                <div
                  key={notice.id}
                  className={index !== 0 ? "border-t border-amber-100" : ""}
                >
                  <button
                    onClick={() => {
                      if (!isOpen) {
                        increaseViewCount(
                          notice.id,
                          notice.view_count ?? 0
                        );
                      }
                    
                      setOpenId(isOpen ? null : notice.id);
                    }}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left hover:bg-amber-50 sm:px-7"
                  >
                    <div className="min-w-0">
                      <div className="mb-2 text-xs font-bold text-amber-700">
                        {new Date(notice.created_at).toLocaleDateString("ko-KR")}
                      </div>

                      <p className="text-xs text-slate-500">
                        조회수 {notice.view_count ?? 0}
                      </p>

                      <h2 className="truncate text-base font-black text-slate-900 sm:text-lg">
                        {notice.title}
                      </h2>
                    </div>

                    <span className="shrink-0 rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-amber-700">
                      {isOpen ? "닫기" : "보기"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-amber-100 bg-[#FFFDF7] px-5 py-6 sm:px-7">

                      <p className="mb-3 text-xs text-red-500">
                        이미지 개수: {noticeImages[Number(notice.id)]?.length ?? 0}
                      </p>

                      {noticeImages[Number(notice.id)]?.length > 0 ? (
                        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {noticeImages[Number(notice.id)].map((image) => (
                            <button
                            key={image.id}
                            type="button"
                            onClick={() => setSelectedImage(image.image_url)}
                            className="block overflow-hidden rounded-2xl border border-amber-100 bg-white"
                          >
                            <img
                              src={image.image_url}
                              alt={notice.title}
                              className="h-32 w-full object-cover sm:h-36"
                            />
                          </button>
                          ))}
                        </div>
                      ) : notice.image_url ? (
                        <button
                          type="button"
                          onClick={() => setSelectedImage(notice.image_url)}
                          className="mb-5 block overflow-hidden rounded-2xl border border-amber-100 bg-white"
                        >
                          <img
                            src={notice.image_url}
                            alt={notice.title}
                            className="h-56 w-full object-cover sm:h-72"
                          />
                        </button>
                      ) : null}

                      <p className="whitespace-pre-line text-sm leading-7 text-slate-700 sm:text-base sm:leading-8">
                        {notice.content}
                      </p>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div className="relative max-h-[90vh] max-w-5xl">
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-900"
            >
              닫기
            </button>

            <img
              src={selectedImage}
              alt="공지 이미지 확대"
              className="max-h-[90vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}