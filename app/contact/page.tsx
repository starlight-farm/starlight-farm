"use client";

import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";

export default function ContactPage() {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [category, setCategory] = useState("제품 문의");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserId(user.id);
    setEmail(user.email ?? "");

    const { data } = await supabase
      .from("profiles")
      .select("name, phone")
      .eq("id", user.id)
      .single();

    if (data) {
      setName(data.name ?? "");
      setPhone(data.phone ?? "");
    }
  };

  const submitInquiry = async () => {
    if (!userId) {
      alert("문의 등록은 로그인 후 이용할 수 있습니다.");
      window.location.href = "/login";
      return;
    }

    if (!title || !content) {
      alert("제목과 문의내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("inquiries").insert({
      user_id: userId,
      name,
      phone,
      email,
      category,
      title,
      content,
      status: "답변대기",
    });

    setSubmitting(false);

    if (error) {
      alert("문의 등록 실패: " + error.message);
      return;
    }

    setTitle("");
    setContent("");
    setCategory("제품 문의");

    alert("문의가 등록되었습니다. 답변은 마이페이지에서 확인할 수 있습니다.");
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <main className="min-h-screen bg-[#FFF8EC] text-slate-900">
      <Header />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="mb-4 text-sm font-bold text-amber-700">Contact</p>

          <h1 className="mb-5 text-4xl font-black md:text-5xl">
            별빛목장 문의하기
          </h1>

          <p className="mx-auto max-w-2xl text-slate-600">
            제품, 배송, 입점, 대량 주문, 별 적립 문의를 남겨주세요.
          </p>
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
            <div className="mb-4 text-4xl">🥛</div>
            <h2 className="mb-3 text-2xl font-black">제품 문의</h2>
            <p className="text-slate-600">
              용량, 보관 방법, 맛, 제품 구성 등을 문의할 수 있습니다.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
            <div className="mb-4 text-4xl">🚚</div>
            <h2 className="mb-3 text-2xl font-black">배송 문의</h2>
            <p className="text-slate-600">
              택배 발송일, 신선 배송, 아이스박스 포장 관련 문의를 남겨주세요.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
            <div className="mb-4 text-4xl">🏪</div>
            <h2 className="mb-3 text-2xl font-black">입점 문의</h2>
            <p className="text-slate-600">
              로컬푸드, 마트, 온라인몰 입점 및 납품 문의가 가능합니다.
            </p>
          </div>

          <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
            <div className="mb-4 text-4xl">🎁</div>
            <h2 className="mb-3 text-2xl font-black">별 적립 문의</h2>
            <p className="text-slate-600">
              구매 인증, 별 적립, 요거트 교환 관련 문의를 남겨주세요.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-black">문의 남기기</h2>

          <div className="grid gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-amber-100 bg-amber-50 p-4"
            >
              <option>제품 문의</option>
              <option>배송 문의</option>
              <option>입점 문의</option>
              <option>대량 주문 문의</option>
              <option>별 적립 문의</option>
              <option>기타 문의</option>
            </select>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="문의 제목"
              className="w-full rounded-xl border border-amber-100 bg-amber-50 p-4"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의 내용을 입력해주세요."
              rows={7}
              className="w-full rounded-xl border border-amber-100 bg-amber-50 p-4"
            />

            <button
              onClick={submitInquiry}
              disabled={submitting}
              className="rounded-full bg-yellow-400 px-8 py-4 font-bold text-slate-950 hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? "등록 중..." : "문의 등록하기"}
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-amber-100 bg-white p-8 text-center shadow-sm">
          <h2 className="mb-5 text-2xl font-black">문의 채널</h2>

          <p className="mb-2 font-bold">전화: 061-870-8871</p>
          <p className="mb-6 font-bold">이메일: sl-farm@naver.com</p>

          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="https://smartstore.naver.com/starlight-farm"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-yellow-400 px-6 py-4 font-bold text-slate-950 hover:bg-yellow-300"
            >
              스마트스토어 문의하기
            </a>

            <a
              href="https://blog.naver.com/starlight-farm_"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-amber-200 bg-amber-50 px-6 py-4 font-bold text-slate-900 hover:bg-amber-100"
            >
              네이버 블로그 방문
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}