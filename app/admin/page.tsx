"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Header from "../../components/Header";

function getLastLoginText(lastLogin: string | null) {
  if (!lastLogin) {
    return "⚪ 접속 기록 없음";
  }

  const now = new Date();
  const login = new Date(lastLogin);

  const diff = Math.floor((now.getTime() - login.getTime()) / 1000);

  if (diff < 60) {
    return "🟢 방금 전";
  }

  if (diff < 3600) {
    return `🟢 ${Math.floor(diff / 60)}분 전`;
  }

  if (diff < 86400) {
    return `🟡 ${Math.floor(diff / 3600)}시간 전`;
  }

  if (diff < 2592000) {
    return `⚪ ${Math.floor(diff / 86400)}일 전`;
  }

  return login.toLocaleDateString("ko-KR");
}

export default function AdminPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [purchaseVerifications, setPurchaseVerifications] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [answerText, setAnswerText] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState("purchase");

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [totalCount, setTotalCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [activeMemberCount, setActiveMemberCount] = useState(0);
  const [withdrawnMemberCount, setWithdrawnMemberCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [orderedCount, setOrderedCount] = useState(0);
  const [canceledOrderCount, setCanceledOrderCount] = useState(0);
  const [totalStarCount, setTotalStarCount] = useState(0);

  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeImages, setNoticeImages] = useState<File[]>([]);

  const [editingNoticeId, setEditingNoticeId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [productName, setProductName] = useState("플레인 요거트 1L");
  const [quantity, setQuantity] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const getStarsByProduct = (product: string, quantity: number) => {
    const starsPerItem = product.includes("1L") ? 2 : 1;
    return starsPerItem * quantity;
  };

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return false;
    }

    if (user.email !== "sl-farm@naver.com") {
      setLoading(false);
      return false;
    }

    setIsAdmin(true);
    return true;
  };

  const loadRequests = async () => {
    const { data, error } = await supabase
      .from("reward_requests")
      .select(`
        id,
        user_id,
        reward_name,
        stars_used,
        status,
        created_at,
        profiles (
          name,
          phone,
          address
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      alert("교환 신청 목록을 불러오지 못했습니다: " + error.message);
      return;
    }

    const rows = data ?? [];

    setTotalCount(rows.length);
    setPendingCount(rows.filter((item) => item.status === "신청완료").length);
    setCompletedCount(rows.filter((item) => item.status === "발송완료").length);
    setRequests(rows);
  };

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        name,
        phone,
        address,
        stars,
        total_stars,
        royal_stars,
        status,
        withdrawn_at,
        withdraw_reason
        last_login_at
      `)
      .order("name", { ascending: true });

    if (error) {
      alert("회원 목록을 불러오지 못했습니다: " + error.message);
      return [];
    }

    const rows = data ?? [];

    setMemberCount(rows.length);

    setActiveMemberCount(
      rows.filter(
        (member) => member.status !== "withdrawn"
      ).length
    );

    setWithdrawnMemberCount(
      rows.filter(
        (member) => member.status === "withdrawn"
      ).length
    );

    const totalStars = rows.reduce(
      (sum, member) => sum + (member.total_stars ?? 0),
      0
    );

    setTotalStarCount(totalStars);

    setMembers(rows);
    return rows;
  };

  const loadNotices = async () => {
    const { data, error } = await supabase
      .from("notices")
      .select("id, title, content, image_url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      alert("공지 목록을 불러오지 못했습니다: " + error.message);
      return;
    }

    setNotices(data ?? []);
  };

  const loadOrders = async (memberRows: any[] = members) => {
    const { data, error } = await supabase
      .from("orders")
      .select("id, member_id, product_name, quantity, stars_given, created_at, status")
      .order("created_at", { ascending: false });

    if (error) {
      alert("주문 내역을 불러오지 못했습니다: " + error.message);
      return;
    }

    const rows = data ?? [];
    setOrderCount(rows.length);
    setOrderedCount(rows.filter((order) => order.status !== "canceled").length);
    setCanceledOrderCount(
      rows.filter((order) => order.status === "canceled").length
    );

    const rowsWithMember = rows.map((order) => {
      const member = memberRows.find((item) => item.id === order.member_id);

      return {
        ...order,
        member_name: member?.name ?? "이름 없음",
        member_phone: member?.phone ?? "전화번호 없음",
      };
    });

    setOrders(rowsWithMember);
  };

  const loadPurchaseVerifications = async () => {
    const { data, error } = await supabase
      .from("purchase_verifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("구매 인증 목록 불러오기 실패: " + error.message);
      return;
    }

    setPurchaseVerifications(data ?? []);
  };

  const loadInquiries = async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
  
    if (error) {
      alert("문의 목록 불러오기 실패: " + error.message);
      return;
    }
  
    setInquiries(data ?? []);
  };

  const loadAll = async () => {
    setLoading(true);
    await loadRequests();
    const memberRows = await loadMembers();
    await loadNotices();
    await loadOrders(memberRows);
    await loadPurchaseVerifications();
    await loadInquiries();
    setLoading(false);
  };

  const completeRequest = async (id: string) => {
    const { error } = await supabase
      .from("reward_requests")
      .update({ status: "발송완료" })
      .eq("id", id);

    if (error) {
      alert("상태 변경 실패: " + error.message);
      return;
    }

    await loadAll();
    alert("발송완료 처리되었습니다.");
  };

  const addStarToMember = async (memberId: string, currentStars: number) => {
    const member = members.find((item) => item.id === memberId);
    const currentTotalStars = member?.total_stars ?? 0;

    const { error } = await supabase
      .from("profiles")
      .update({
        stars: currentStars + 1,
        total_stars: currentTotalStars + 1,
      })
      .eq("id", memberId);

    if (error) {
      alert("별 지급 실패: " + error.message);
      return;
    }

    await loadAll();
    alert("별 1개가 지급되었습니다.");
  };

  const restoreMember = async (memberId: string) => {
    const ok = window.confirm(
      "이 회원 계정을 복구하시겠습니까?"
    );
  
    if (!ok) return;
  
    const { error } = await supabase
      .from("profiles")
      .update({
        status: "active",
        withdrawn_at: null,
        withdraw_reason: null,
      })
      .eq("id", memberId);
  
    if (error) {
      alert("복구 실패: " + error.message);
      return;
    }
  
    alert("회원이 복구되었습니다.");
  
    loadMembers();
  };

  const filteredMembers = members.filter((member) => {
    const keyword = searchKeyword.toLowerCase();

    return (
      (member.name ?? "").toLowerCase().includes(keyword) ||
      (member.phone ?? "").includes(keyword) ||
      (member.address ?? "").toLowerCase().includes(keyword)
    );
  });

  const saveOrder = async () => {
    if (!selectedMemberId) {
      alert("회원을 선택하세요.");
      return;
    }

    if (!productName.trim()) {
      alert("상품명을 입력하세요.");
      return;
    }

    if (quantity < 1) {
      alert("수량은 1개 이상이어야 합니다.");
      return;
    }

    const member = members.find((item) => item.id === selectedMemberId);

    if (!member) {
      alert("회원 정보를 찾을 수 없습니다.");
      return;
    }

    const starsToGive = getStarsByProduct(productName, quantity);
    const newStars = (member.stars ?? 0) + starsToGive;
    const newTotalStars = (member.total_stars ?? 0) + starsToGive;

    const { error: orderError } = await supabase.from("orders").insert({
      member_id: selectedMemberId,
      product_name: productName,
      quantity,
      stars_given: starsToGive,
      status: "ordered",
    });

    if (orderError) {
      alert("주문 등록 실패: " + orderError.message);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        stars: newStars,
        total_stars: newTotalStars,
      })
      .eq("id", selectedMemberId);

    if (profileError) {
      alert("별 적립 실패: " + profileError.message);
      return;
    }

    setSelectedMemberId("");
    setProductName("플레인 요거트 1L");
    setQuantity(1);

    await loadAll();

    alert(`주문 등록 완료! 별 ${starsToGive}개가 적립되었습니다.`);
  };

  const cancelOrder = async (order: any) => {
    const ok = confirm("이 주문을 취소하고 적립된 별을 회수할까요?");

    if (!ok) return;

    const member = members.find((item) => item.id === order.member_id);

    if (!member) {
      alert("회원 정보를 찾을 수 없습니다.");
      return;
    }

    const starsToRemove = order.stars_given ?? 0;

    const newStars = Math.max(0, (member.stars ?? 0) - starsToRemove);
    const newTotalStars = Math.max(
      0,
      (member.total_stars ?? 0) - starsToRemove
    );

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        stars: newStars,
        total_stars: newTotalStars,
      })
      .eq("id", order.member_id);

    if (profileError) {
      alert("별 회수 실패: " + profileError.message);
      return;
    }

    const { error: orderError } = await supabase
      .from("orders")
      .update({
        status: "canceled",
      })
      .eq("id", order.id);

    if (orderError) {
      alert("주문 삭제 실패: " + orderError.message);
      return;
    }

    await loadAll();

    alert(`주문이 취소상태로 변경되고 별 ${starsToRemove}개가 회수되었습니다.`);
  };

  const approveVerification = async (item: any) => {
    const member = members.find(
      (m) => m.id === item.user_id
    );

    if (!member) {
      alert("회원을 찾을 수 없습니다.");
      return;
    }

    const starsToGive = getStarsByProduct(item.product_name, item.quantity);

    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        member_id: item.user_id,
        product_name: item.product_name,
        quantity: item.quantity,
        stars_given: starsToGive,
        status: "ordered",
      });

    if (orderError) {
      alert("주문 생성 실패: " + orderError.message);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        stars: (member.stars ?? 0) + starsToGive,
        total_stars: (member.total_stars ?? 0) + starsToGive,
      })
      .eq("id", item.user_id);

    if (profileError) {
      alert("별 적립 실패: " + profileError.message);
      return;
    }

    const { error: verifyError } = await supabase
      .from("purchase_verifications")
      .update({
        status: "approved",
      })
      .eq("id", item.id);

    if (verifyError) {
      alert("승인 처리 실패");
      return;
    }

    await loadAll();

    alert(`승인 완료! 별 ${starsToGive}개 적립`);
  };

  const rejectVerification = async (item: any) => {
    const ok = confirm("이 구매 인증 신청을 반려할까요?");

    if (!ok) return;

    const { error } = await supabase
      .from("purchase_verifications")
      .update({
        status: "rejected",
      })
      .eq("id", item.id);

    if (error) {
      alert("반려 처리 실패: " + error.message);
      return;
    }

    await loadAll();

    alert("구매 인증 신청이 반려되었습니다.");
  };

  const saveNotice = async () => {
    if (!noticeTitle.trim()) {
      alert("공지 제목을 입력하세요.");
      return;
    }
  
    if (!noticeContent.trim()) {
      alert("공지 내용을 입력하세요.");
      return;
    }
  
    const { data: noticeData, error: noticeError } = await supabase
      .from("notices")
      .insert({
        title: noticeTitle,
        content: noticeContent,
        image_url: null,
      })
      .select("id")
      .single();
  
    if (noticeError) {
      alert("공지 저장 실패: " + noticeError.message);
      return;
    }
  
    if (noticeImages.length > 0) {
      for (let i = 0; i < noticeImages.length; i++) {
        const file = noticeImages[i];
        const extension = file.name.split(".").pop();

        const fileName =
          `${Date.now()}-${i}.${extension}`;
  
        const { error: uploadError } = await supabase.storage
          .from("notice-images")
          .upload(fileName, file);
  
        if (uploadError) {
          alert("이미지 업로드 실패: " + uploadError.message);
          return;
        }
  
        const { data } = supabase.storage
          .from("notice-images")
          .getPublicUrl(fileName);
  
          const { error: imageInsertError } = await supabase
          .from("notice_images")
          .insert({
            notice_id: noticeData.id,
            image_url: data.publicUrl,
            sort_order: i,
          });
        
        if (imageInsertError) {
          alert("공지 이미지 저장 실패: " + imageInsertError.message);
          return;
        }
  
        if (i === 0) {
          await supabase
            .from("notices")
            .update({ image_url: data.publicUrl })
            .eq("id", noticeData.id);
        }
      }
    }
  
    setNoticeTitle("");
    setNoticeContent("");
    setNoticeImages([]);
  
    await loadNotices();
  
    alert("공지 저장 완료!");
  };

  const startEditNotice = (notice: any) => {
    setEditingNoticeId(notice.id);
    setEditTitle(notice.title);
    setEditContent(notice.content);
  };

  const cancelEditNotice = () => {
    setEditingNoticeId(null);
    setEditTitle("");
    setEditContent("");
  };

  const updateNotice = async () => {
    if (!editingNoticeId) return;

    if (!editTitle.trim()) {
      alert("수정할 제목을 입력하세요.");
      return;
    }

    if (!editContent.trim()) {
      alert("수정할 내용을 입력하세요.");
      return;
    }

    const { error } = await supabase
      .from("notices")
      .update({
        title: editTitle,
        content: editContent,
      })
      .eq("id", editingNoticeId);

    if (error) {
      alert("공지 수정 실패: " + error.message);
      return;
    }

    cancelEditNotice();
    await loadNotices();
    alert("공지 수정 완료!");
  };

  const deleteNotice = async (id: number) => {
    const ok = confirm("이 공지를 삭제할까요?");

    if (!ok) return;

    const { error } = await supabase.from("notices").delete().eq("id", id);

    if (error) {
      alert("공지 삭제 실패: " + error.message);
      return;
    }

    await loadNotices();
    alert("공지 삭제 완료!");
  };

  const saveInquiryAnswer = async (inquiry: any) => {
    const answer = answerText[inquiry.id];
  
    if (!answer?.trim()) {
      alert("답변을 입력하세요.");
      return;
    }
  
    const { data, error } = await supabase
      .from("inquiries")
      .update({
        answer,
        status: "답변완료",
        answered_at: new Date().toISOString(),
      })
      .eq("id", inquiry.id)
      .select();
  
    if (error) {
      alert("답변 저장 실패: " + error.message);
      return;
    }
  
    if (!data || data.length === 0) {
      alert("답변 저장 실패: 수정된 문의가 없습니다. RLS 정책을 확인하세요.");
      return;
    }
  
    await loadInquiries();
    alert("답변 저장 완료");
  };

  useEffect(() => {
    const init = async () => {
      const ok = await checkAdmin();

      if (ok) {
        await loadAll();
      }
    };

    init();
  }, []);

  if (!loading && !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">접근 불가</h1>
          <p>관리자만 접근할 수 있습니다.</p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <p>관리자 정보를 불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold">관리자 페이지</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-7">
        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">전체 회원</p>
          <p className="text-3xl font-bold">{memberCount}</p>
        </div>

        <div className="rounded-xl bg-green-800 p-4">
          <p className="text-sm text-green-200">정상 회원</p>
          <p className="text-3xl font-bold">
            {activeMemberCount}
          </p>
        </div>

        <div className="rounded-xl bg-red-800 p-4">
          <p className="text-sm text-red-200">탈퇴 회원</p>
          <p className="text-3xl font-bold">
            {withdrawnMemberCount}
          </p>
        </div>

        <div className="rounded-xl bg-blue-900 p-4">
          <p className="text-sm text-blue-200">전체 주문</p>
          <p className="text-3xl font-bold">{orderCount}</p>
        </div>

        <div className="rounded-xl bg-green-900 p-4">
          <p className="text-sm text-green-200">주문완료</p>
          <p className="text-3xl font-bold">{orderedCount}</p>
        </div>

        <div className="rounded-xl bg-red-900 p-4">
          <p className="text-sm text-red-200">주문취소</p>
          <p className="text-3xl font-bold">{canceledOrderCount}</p>
        </div>

        <div className="rounded-xl bg-yellow-900 p-4">
          <p className="text-sm text-yellow-200">누적 별</p>
          <p className="text-3xl font-bold">{totalStarCount}</p>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab("purchase")}
          className={`rounded-full px-4 py-2 font-bold ${
            activeTab === "purchase"
              ? "bg-yellow-400 text-slate-950"
              : "bg-slate-800 text-white"
          }`}
        >
          구매인증
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`rounded-full px-4 py-2 font-bold ${
            activeTab === "orders"
              ? "bg-yellow-400 text-slate-950"
              : "bg-slate-800 text-white"
          }`}
        >
          주문관리
        </button>

        <button
          onClick={() => setActiveTab("notices")}
          className={`rounded-full px-4 py-2 font-bold ${
            activeTab === "notices"
              ? "bg-yellow-400 text-slate-950"
              : "bg-slate-800 text-white"
          }`}
        >
          공지사항
        </button>

        <button
          onClick={() => setActiveTab("members")}
          className={`rounded-full px-4 py-2 font-bold ${
            activeTab === "members"
              ? "bg-yellow-400 text-slate-950"
              : "bg-slate-800 text-white"
          }`}
        >
          회원관리
        </button>

        <button
          onClick={() => setActiveTab("inquiries")}
          className={`rounded-full px-4 py-2 font-bold ${
            activeTab === "inquiries"
              ? "bg-yellow-400 text-slate-950"
              : "bg-slate-800 text-white"
          }`}
        >
          문의관리
        </button>

        <button
          onClick={() => setActiveTab("rewards")}
          className={`rounded-full px-4 py-2 font-bold ${
            activeTab === "rewards"
              ? "bg-yellow-400 text-slate-950"
              : "bg-slate-800 text-white"
          }`}
        >
          교환신청
        </button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-sm text-slate-400">전체 교환신청</p>
          <p className="text-3xl font-bold">{totalCount}</p>
        </div>

        <div className="rounded-xl bg-yellow-900 p-4">
          <p className="text-sm text-yellow-200">신청완료</p>
          <p className="text-3xl font-bold">{pendingCount}</p>
        </div>

        <div className="rounded-xl bg-green-900 p-4">
          <p className="text-sm text-green-200">발송완료</p>
          <p className="text-3xl font-bold">{completedCount}</p>
        </div>
      </div>

    {activeTab === "purchase" && (
      <div className="mb-8 rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">
          구매 인증 신청 목록
        </h2>

        {purchaseVerifications.length === 0 ? (
          <p className="text-slate-400">
            신청된 구매 인증이 없습니다.
          </p>
        ) : (
          <div className="space-y-4">
            {purchaseVerifications.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <p className="font-bold">
                  주문번호 : {item.order_number}
                </p>

                <p>구매자 : {item.buyer_name}</p>

                <p>제품 : {item.product_name}</p>

                <p>수량 : {item.quantity}</p>

                <p
                  className={`font-bold ${
                    item.status === "approved"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {item.status}
                </p>

                {item.status === "pending" && (
                 <div className="mt-3 flex gap-2">
                    <button
                        onClick={() => approveVerification(item)}
                        className="rounded-lg bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-400"
                      >
                        승인
                      </button>

                      <button
                        onClick={() => rejectVerification(item)}
                        className="rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-400"
                      >
                        반려
                      </button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    )}
    {activeTab === "orders" && (
      <>
      <div className="mb-8 rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">주문 등록 / 별 자동 적립</h2>

        <div className="grid gap-4 md:grid-cols-4">
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="rounded-lg bg-slate-800 p-3 text-white outline-none"
          >
            <option value="">회원 선택</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name ?? "이름 없음"} / 별 {member.stars ?? 0}개
              </option>
            ))}
          </select>

          <select
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="rounded-lg bg-slate-800 p-3 text-white outline-none"
          >
            <option value="플레인 요거트 500ml">플레인 요거트 500ml</option>
            <option value="플레인 요거트 1L">플레인 요거트 1L</option>
            <option value="블루베리 요거트 500ml">블루베리 요거트 500ml</option>
            <option value="블루베리 요거트 1L">블루베리 요거트 1L</option>
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="rounded-lg bg-slate-800 p-3 text-white outline-none"
          />

          <button
            onClick={saveOrder}
            className="rounded-lg bg-yellow-400 px-5 py-3 font-bold text-slate-950 hover:bg-yellow-300"
          >
            주문 등록
          </button>
        </div>

        <p className="mt-3 text-sm text-slate-400">
           500ml는 수량 1개당 별 1개, 1L는 수량 1개당 별 2개가 자동 적립됩니다.
        </p>
      </div>

      <div className="mb-8 rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">주문 내역</h2>

        {orders.length === 0 ? (
          <p className="text-slate-400">등록된 주문이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <p className="font-bold">
                  {order.member_name ?? "이름 없음"} / {order.product_name}
                </p>

                <p className="text-sm text-slate-300">
                  수량: {order.quantity}개
                </p>

                <p className="text-sm font-bold text-yellow-300">
                  적립 별: {order.stars_given}개
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  등록일:{" "}
                  {new Date(order.created_at).toLocaleDateString("ko-KR")}
                </p>

                <p
                  className={`mt-2 text-sm font-bold ${
                    order.status === "canceled" ? "text-red-400" : "text-green-400"
                  }`}
                >
                  상태: {order.status === "canceled" ? "주문취소" : "주문완료"}
                </p>

                {order.status !== "canceled" && (
                  <button
                    onClick={() => cancelOrder(order)}
                    className="mt-3 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-400"
                  >
                    주문 취소
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </>
    )}

    {activeTab === "notices" && (
      <>
      <div className="mb-8 rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">공지사항 작성</h2>

        <input
          value={noticeTitle}
          onChange={(e) => setNoticeTitle(e.target.value)}
          placeholder="공지 제목"
          className="mb-4 w-full rounded-lg bg-slate-800 p-3 text-white outline-none placeholder:text-slate-500"
        />

        <textarea
          value={noticeContent}
          onChange={(e) => setNoticeContent(e.target.value)}
          placeholder="공지 내용"
          rows={6}
          className="mb-4 w-full rounded-lg bg-slate-800 p-3 text-white outline-none placeholder:text-slate-500"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setNoticeImages(Array.from(e.target.files ?? []))
          }
          className="mb-4 w-full rounded-lg bg-slate-800 p-3 text-white"
        />

        <button
          onClick={saveNotice}
          className="rounded-lg bg-pink-500 px-5 py-3 font-bold text-white hover:bg-pink-400"
        >
          공지 저장
        </button>
      </div>

      <div className="mb-8 rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">공지사항 관리</h2>

        {notices.length === 0 ? (
          <p className="text-slate-400">등록된 공지사항이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                {editingNoticeId === notice.id ? (
                  <>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mb-3 w-full rounded-lg bg-slate-800 p-3 text-white outline-none"
                    />

                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={5}
                      className="mb-3 w-full rounded-lg bg-slate-800 p-3 text-white outline-none"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={updateNotice}
                        className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-400"
                      >
                        수정완료
                      </button>

                      <button
                        onClick={cancelEditNotice}
                        className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-bold text-white hover:bg-slate-500"
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-slate-500">
                      {new Date(notice.created_at).toLocaleDateString("ko-KR")}
                    </p>

                    <h3 className="mt-1 text-lg font-bold">{notice.title}</h3>

                    {notice.image_url && (
                      <img
                        src={notice.image_url}
                        alt={notice.title}
                        className="mt-3 mb-3 max-h-64 rounded-xl"
                      />
                    )}

                    <p className="mt-2 whitespace-pre-line text-sm text-slate-300">
                      {notice.content}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => startEditNotice(notice)}
                        className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-300"
                      >
                        수정
                      </button>

                      <button
                        onClick={() => deleteNotice(notice.id)}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-400"
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </>
    )}
    {activeTab === "members" && (
      <div className="mb-8 rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">회원 관리</h2>

        <input
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="이름, 전화번호, 주소 검색"
          className="mb-4 w-full rounded-lg bg-slate-800 p-3 text-white outline-none placeholder:text-slate-500"
        />

        {members.length === 0 ? (
          <p className="text-slate-400">회원이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center gap-2">
                  <p className="font-bold">
                    {member.name ?? "이름 없음"}
                  </p>

                  {member.status === "withdrawn" && (
                    <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white">
                      탈퇴회원
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-300">
                  휴대폰: {member.phone ?? "전화번호 없음"}
                </p>

                <p className="text-sm text-slate-300">
                  주소: {member.address ?? "주소 없음"}
                </p>

                <p className="text-sm font-bold text-yellow-300">
                  보유 별: {member.stars ?? 0}개
                </p>

                <p className="text-sm text-cyan-300">
                  마지막 접속 : {getLastLoginText(member.last_login_at)}
                </p>

                <p className="text-sm font-bold text-pink-300">
                  누적 별: {member.total_stars ?? 0}개
                </p>

                <p className="text-sm font-bold text-red-400">
                  왕별: {member.royal_stars ?? 0}개
                </p>

                {member.status === "withdrawn" && (
                  <>
                    <p className="mt-2 text-sm text-red-300">
                      탈퇴일 :
                      {" "}
                      {member.withdrawn_at
                        ? new Date(member.withdrawn_at).toLocaleDateString("ko-KR")
                        : "-"}
                    </p>

                    <p className="text-sm text-red-200">
                      탈퇴사유 :
                      {" "}
                      {member.withdraw_reason || "미입력"}
                    </p>

                    <button
                      onClick={() => restoreMember(member.id)}
                      className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
                    >
                      계정 복구
                    </button>

                  </>
                )}

                {member.status !== "withdrawn" && (
                  <button
                    onClick={() => addStarToMember(member.id, member.stars ?? 0)}
                    className="mt-3 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-300"
                  >
                    별 1개 지급
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {activeTab === "inquiries" && (
      <div className="mb-8 rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">문의 관리</h2>

        {inquiries.length === 0 ? (
          <p className="text-slate-400">등록된 문의가 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {inquiries.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <p className="font-bold">{item.title}</p>

                <p className="text-sm text-slate-300">
                  분류: {item.category}
                </p>

                <p className="text-sm text-slate-300">
                  작성자: {item.name}
                </p>

                <p className="mt-2 whitespace-pre-line text-slate-200">
                  {item.content}
                </p>

                <p
                  className={`mt-3 font-bold ${
                    item.status === "답변완료"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {item.status}
                </p>

                {item.answer && (
                  <div className="mt-3 rounded-lg bg-green-900/30 p-3">
                    <p className="font-bold text-green-300">
                      관리자 답변
                    </p>

                    <p className="mt-2 whitespace-pre-line">
                      {item.answer}
                    </p>
                  </div>
                )}

                {item.status !== "답변완료" && (
                  <div className="mt-4">
                    <textarea
                      rows={4}
                      value={answerText[item.id] ?? ""}
                      onChange={(e) =>
                        setAnswerText({
                          ...answerText,
                          [item.id]: e.target.value,
                        })
                      }
                      placeholder="답변 입력"
                      className="mb-3 w-full rounded-lg bg-slate-800 p-3 text-white"
                    />

                    <button
                      onClick={() => saveInquiryAnswer(item)}
                      className="rounded-lg bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-400"
                    >
                      답변 저장
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {activeTab === "rewards" && (
      <div className="rounded-2xl bg-slate-900 p-6">
        <h2 className="mb-4 text-2xl font-bold">교환 신청 목록</h2>

        {requests.length === 0 ? (
          <p className="text-slate-400">아직 교환 신청이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <p className="font-bold">{request.reward_name}</p>

                <p className="mt-2 text-sm text-slate-300">
                  신청자: {request.profiles?.name ?? "이름 없음"}
                </p>

                <p className="text-sm text-slate-300">
                  휴대폰: {request.profiles?.phone ?? "전화번호 없음"}
                </p>

                <p className="text-sm text-slate-300">
                  주소: {request.profiles?.address ?? "주소 없음"}
                </p>

                <p className="text-sm text-slate-300">
                  사용 별: {request.stars_used}개
                </p>

                <p
                  className={`text-sm font-bold ${
                    request.status === "발송완료"
                      ? "text-green-300"
                      : "text-yellow-300"
                  }`}
                >
                  상태: {request.status}
                </p>

                {request.status !== "발송완료" && (
                  <button
                    onClick={() => completeRequest(request.id)}
                    className="mt-3 rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-400"
                  >
                    발송완료
                  </button>
                )}

                <p className="mt-3 text-xs text-slate-500">
                  신청일:{" "}
                  {new Date(request.created_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    )}  
    </main>
  );
}
