"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";

export default function NoticePage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotices = async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      alert("공지사항을 불러오지 못했습니다: " + error.message);
      setLoading(false);
      return;
    }

    setNotices(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadNotices();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8EC] text-slate-900">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
        <p className="mb-3 text-sm font-bold text-amber-700">
          Notice
        </p>
          <h1 className="mb-4 text-5xl font-bold">공지사항</h1>

          <p className="text-slate-600">
            별빛목장의 새로운 소식과 배송 안내를 확인하세요.
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
          <div className="space-y-6">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-2 text-sm text-slate-400">
                  {new Date(notice.created_at).toLocaleDateString("ko-KR")}
                </div>

                <h2 className="mb-3 text-xl font-bold">{notice.title}</h2>

                <p className="whitespace-pre-line text-slate-700">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}