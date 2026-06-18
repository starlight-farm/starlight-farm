"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";
import Header from "../../components/Header";
import "./sky.css";

export default function MyPage() {
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [stars, setStars] = useState(0);
  const [royalStars, setRoyalStars] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [positions, setPositions] = useState<any>({});
  const [connections, setConnections] = useState<any[]>([]);
  const [selectedStar, setSelectedStar] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [shareId, setShareId] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("sky");

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [verifyProduct, setVerifyProduct] = useState("");
  const [verifyQuantity, setVerifyQuantity] = useState(1);
  const [shootingStars, setShootingStars] = useState<any[]>([]);

  const skyRef = useRef<HTMLDivElement | null>(null);

  const visibleStars = Math.min(stars, 200);
  const visibleRoyalStars = Math.min(royalStars, 30);
  const remainingStars = stars >= 40 ? 0 : 40 - stars;

  const getGrade = (count: number) => {
    if (count >= 1000) return "별자리 마스터";
    if (count >= 500) return "별빛 VIP";
    if (count >= 100) return "은하수 단골";
    if (count >= 1) return "첫 왕별 회원";
    return "별빛 새싹";
  };
  
  const defaultSmallPosition = (index: number) => {
    const row = Math.floor(index / 10);
    const col = index % 10;
  
    return {
      top: 22 + row * 4,
      left: 30 + col * 4,
    };
  };
  
  const defaultRoyalPosition = (index: number) => {
    const row = Math.floor(index / 5);
    const col = index % 5;
  
    return {
      top: 14 + row * 6,
      left: 38 + col * 6,
    };
  };

  const getPosition = (key: string, type: "small" | "royal", index: number) => {
    if (positions[key]) return positions[key];

    return type === "small"
      ? defaultSmallPosition(index)
      : defaultRoyalPosition(index);
  };

  const getPositionByKey = (key: string) => {
    if (positions[key]) return positions[key];

    if (key.startsWith("small-")) {
      const index = Number(key.replace("small-", ""));
      return defaultSmallPosition(index);
    }

    if (key.startsWith("royal-")) {
      const index = Number(key.replace("royal-", ""));
      return defaultRoyalPosition(index);
    }

    return null;
  };

  const saveSkyToSupabase = async (
    newPositions: any,
    newConnections: any[]
  ) => {
    if (!userId) return;

    const { error } = await supabase.from("user_sky").upsert({
      user_id: userId,
      positions: newPositions,
      connections: newConnections,
      share_id: shareId || null,
      is_public: shareId ? true : false,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("밤하늘 저장 실패:", error.message);
    }
  };

  const savePositions = (newPositions: any) => {
    setPositions(newPositions);

    localStorage.setItem(
      `star_positions_${userId}`,
      JSON.stringify(newPositions)
    );

    saveSkyToSupabase(newPositions, connections);
  };

  const saveConnections = (newConnections: any[]) => {
    setConnections(newConnections);

    localStorage.setItem(
      `star_connections_${userId}`,
      JSON.stringify(newConnections)
    );

    saveSkyToSupabase(positions, newConnections);
  };

  const createShareLink = async () => {
    if (!userId) return;

    const newShareId =
      shareId ||
      `${userId}-${Date.now()}`
        .replaceAll("-", "")
        .replaceAll("_", "")
        .replaceAll(".", "");

    const { error } = await supabase.from("user_sky").upsert({
      user_id: userId,
      positions,
      connections,
      share_id: newShareId,
      is_public: true,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      alert("공유 링크 만들기 실패: " + error.message);
      return;
    }

    setShareId(newShareId);

    const shareUrl = `${window.location.origin}/sky/${newShareId}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("별자리 공유 링크가 복사되었습니다.\n\n" + shareUrl);
    } catch {
      alert("공유 링크입니다.\n\n" + shareUrl);
    }
  };

  const handlePointerDown = (
    e: React.PointerEvent<HTMLSpanElement>,
    key: string
  ) => {
    e.preventDefault();
  
    setDragging(key);
    setHasMoved(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !skyRef.current || !dragStart) return;
  
    e.preventDefault();
  
    const movedDistance =
      Math.abs(e.clientX - dragStart.x) + Math.abs(e.clientY - dragStart.y);
  
    if (movedDistance < 8) return;
  
    setHasMoved(true);
  
    const rect = skyRef.current.getBoundingClientRect();
  
    const left = ((e.clientX - rect.left) / rect.width) * 100;
    const top = ((e.clientY - rect.top) / rect.height) * 100;
  
    const fixedLeft = Math.max(2, Math.min(98, left));
    const fixedTop = Math.max(2, Math.min(98, top));
  
    savePositions({
      ...positions,
      [dragging]: {
        top: fixedTop,
        left: fixedLeft,
      },
    });
  };
  
  const handlePointerUp = () => {
    if (dragging && !hasMoved) {
      handleStarSelect(dragging);
    }
  
    if (dragging && hasMoved) {
      saveSkyToSupabase(positions, connections);
    }
  
    setDragging(null);
    setDragStart(null);
    setHasMoved(false);
  };

  const handleStarSelect = (key: string) => {
    if (hasMoved) {
      setHasMoved(false);
      return;
    }

    if (!selectedStar) {
      setSelectedStar(key);
      return;
    }

    if (selectedStar === key) {
      setSelectedStar(null);
      return;
    }

    const alreadyConnected = connections.some(
      (line) =>
        (line.from === selectedStar && line.to === key) ||
        (line.from === key && line.to === selectedStar)
    );

    if (alreadyConnected) {
      const filteredConnections = connections.filter(
        (line) =>
          !(
            (line.from === selectedStar && line.to === key) ||
            (line.from === key && line.to === selectedStar)
          )
      );

      saveConnections(filteredConnections);
      setSelectedStar(null);
      return;
    }

    const newConnections = [...connections, { from: selectedStar, to: key }];
    saveConnections(newConnections);
    setSelectedStar(null);
  };

  const resetStarPositions = () => {
    const ok = window.confirm("별 위치를 달 아래로 다시 모을까요?");
    if (!ok) return;

    const newPositions: any = {};

    for (let i = 0; i < visibleStars; i++) {
      newPositions[`small-${i}`] = {
        top: 18 + Math.floor(i / 8) * 2.6,
        left: 12 + (i % 8) * 2.6,
      };
    }

    for (let i = 0; i < visibleRoyalStars; i++) {
      newPositions[`royal-${i}`] = {
        top: 11 + Math.floor(i / 4) * 4,
        left: 9 + (i % 4) * 4,
      };
    }

    setPositions(newPositions);

    localStorage.setItem(
      `star_positions_${userId}`,
      JSON.stringify(newPositions)
    );

    saveSkyToSupabase(newPositions, connections);
  };

  const resetConnections = () => {
    const ok = window.confirm("연결선을 모두 지울까요?");
    if (!ok) return;

    localStorage.removeItem(`star_connections_${userId}`);
    setConnections([]);
    setSelectedStar(null);
    saveSkyToSupabase(positions, []);
  };

  const loadRewardRequests = async (id: string) => {
    const { data, error } = await supabase
      .from("reward_requests")
      .select("id, reward_name, stars_used, status, created_at")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      alert("교환 내역을 불러오지 못했습니다: " + error.message);
      return;
    }

    setRequests(data ?? []);
  };

  const loadOrders = async (id: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select("id, product_name, quantity, stars_given, created_at, status")
      .eq("member_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      alert("구매내역을 불러오지 못했습니다: " + error.message);
      return;
    }

    setOrders(data ?? []);
  };

  const loadVerifications = async (id: string) => {
    const { data, error } = await supabase
      .from("purchase_verifications")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      alert("구매 인증 내역을 불러오지 못했습니다: " + error.message);
      return;
    }

    setVerifications(data ?? []);
  };

  const loadInquiries = async (id: string) => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false });
  
    if (error) {
      alert("문의 내역을 불러오지 못했습니다: " + error.message);
      return;
    }
  
    setInquiries(data ?? []);
  };

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    setUserId(user.id);

    const savedPositions = localStorage.getItem(`star_positions_${user.id}`);
    if (savedPositions) {
      setPositions(JSON.parse(savedPositions));
    }

    const savedConnections = localStorage.getItem(
      `star_connections_${user.id}`
    );
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }

    const { data: skyData } = await supabase
      .from("user_sky")
      .select("positions, connections, share_id, is_public")
      .eq("user_id", user.id)
      .maybeSingle();

    if (skyData) {
      setPositions(skyData.positions || {});
      setConnections(skyData.connections || []);
      setShareId(skyData.share_id || "");

      localStorage.setItem(
        `star_positions_${user.id}`,
        JSON.stringify(skyData.positions || {})
      );

      localStorage.setItem(
        `star_connections_${user.id}`,
        JSON.stringify(skyData.connections || [])
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("name, phone, address, stars, royal_stars, total_stars")
      .eq("id", user.id)
      .single();

    if (error) {
      alert("회원정보를 불러오지 못했습니다: " + error.message);
      setLoading(false);
      return;
    }

    setName(data.name);
    setPhone(data.phone ?? "");
    setAddress(data.address ?? "");

    setEditName(data.name ?? "");
    setEditPhone(data.phone ?? "");
    setEditAddress(data.address ?? "");

    setStars(data.stars ?? 0);
    setRoyalStars(data.royal_stars ?? 0);
    setTotalStars(data.total_stars ?? 0);

    await loadRewardRequests(user.id);
    await loadOrders(user.id);
    await loadVerifications(user.id);
    await loadInquiries(user.id);

    setLoading(false);
  };

    const saveProfile = async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: editName,
          phone: editPhone,
          address: editAddress,
        })
        .eq("id", userId);

      if (error) {
        alert("회원정보 수정 실패: " + error.message);
        return;
      }

      setName(editName);
      setPhone(editPhone);
      setAddress(editAddress);

      setEditingProfile(false);

      alert("회원정보가 수정되었습니다.");
    };

  const exchangeYogurt = async () => {
    if (processing) return;

    if (stars < 40) {
      alert("별 40개부터 요거트 1L로 교환할 수 있습니다.");
      return;
    }

    const confirmExchange = window.confirm(
      "별 40개를 사용해서 요거트 1L 교환을 신청하시겠습니까?"
    );

    if (!confirmExchange) return;

    setProcessing(true);

    const newStars = stars - 40;
    const newRoyalStars = royalStars + 1;

    const { error: insertError } = await supabase.from("reward_requests").insert({
      user_id: userId,
      reward_name: "별빛목장 요거트 1L",
      stars_used: 40,
      status: "신청완료",
    });

    if (insertError) {
      alert("교환 신청 저장 실패: " + insertError.message);
      setProcessing(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        stars: newStars,
        royal_stars: newRoyalStars,
      })
      .eq("id", userId);

    if (updateError) {
      alert("별 차감 실패: " + updateError.message);
      setProcessing(false);
      return;
    }

    setStars(newStars);
    setRoyalStars(newRoyalStars);
    await loadRewardRequests(userId);

    setProcessing(false);
    alert("요거트 1L 교환 신청이 완료되었습니다. 빨간 왕별이 1개 생겼어요.");
  };

    const cancelOrder = async (orderId: number) => {
      const targetOrder = orders.find((order) => order.id === orderId);

      if (!targetOrder) {
        alert("취소할 주문 정보를 찾지 못했습니다.");
        return;
      }

      if (targetOrder.status === "canceled") {
        alert("이미 취소된 주문입니다.");
        return;
      }

      const starsToRemove = targetOrder.stars_given ?? 0;

      const ok = window.confirm(
        `주문을 취소하시겠습니까?\n\n취소 시 적립된 별 ${starsToRemove}개가 회수됩니다.`
      );

      if (!ok) return;

      const newStars = Math.max(0, stars - starsToRemove);
      const newTotalStars = Math.max(0, totalStars - starsToRemove);

      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: "canceled",
        })
        .eq("id", orderId)
        .neq("status", "canceled");

      if (orderError) {
        alert("주문 취소 실패: " + orderError.message);
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          stars: newStars,
          total_stars: newTotalStars,
        })
        .eq("id", userId);

      if (profileError) {
        alert("별 회수 실패: " + profileError.message);
        return;
      }

      setStars(newStars);
      setTotalStars(newTotalStars);

      await loadOrders(userId);

      alert(`주문이 취소되었습니다. 적립 별 ${starsToRemove}개가 회수되었습니다.`);
    };

    const submitVerification = async () => {
      if (!orderNumber || !verifyProduct) {
        alert("주문번호와 제품명을 입력해주세요.");
        return;
      }

      const { data: exists } = await supabase
        .from("purchase_verifications")
        .select("id")
        .eq("order_number", orderNumber)
        .maybeSingle();

      if (exists) {
        alert("이미 등록된 주문번호입니다.");
        return;
      }

      const { error } = await supabase
        .from("purchase_verifications")
        .insert({
          user_id: userId,
          order_number: orderNumber,
          buyer_name: name,
          buyer_phone: phone,
          product_name: verifyProduct,
          quantity: verifyQuantity,
          status: "pending",
        });

      if (error) {
        alert("신청 실패: " + error.message);
        return;
      }

      setOrderNumber("");
      setVerifyProduct("");
      setVerifyQuantity(1);

      alert("구매 인증 신청이 완료되었습니다.");
    };

  useEffect(() => {
    loadProfile();
  }, []);
  useEffect(() => {
    if (totalStars < 100) return;
  
    const createShootingStar = () => {
      const id = Date.now() + Math.random();
  
      const newStar = {
        id,
        top: 5 + Math.random() * 45,
        right: -15 - Math.random() * 25,
        duration: 4 + Math.random() * 4,
        distanceX: 900 + Math.random() * 700,
        distanceY: 450 + Math.random() * 350,
      };
  
      setShootingStars((prev) => [...prev, newStar]);
  
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((star) => star.id !== id));
      }, newStar.duration * 1000);
    };
  
    const firstTimer = setTimeout(createShootingStar, 1500);
  
    const interval = setInterval(() => {
      createShootingStar();
    }, 5000 + Math.random() * 5000);
  
    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [totalStars]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <Header />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p>나의 밤하늘을 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Header />

      <div className="flex justify-center p-4">
        <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="mb-4 text-5xl">🌙</div>

          <h1 className="mb-3 text-4xl font-bold">나의 밤하늘</h1>

          <p className="mb-3 text-xl font-bold">{name}님, 환영합니다.</p>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {[
              { key: "sky", label: "밤하늘" },
              { key: "verify", label: "구매인증" },
              { key: "orders", label: "구매내역" },
              { key: "rewards", label: "교환내역" },
              { key: "inquiries", label: "문의내역" },
              { key: "profile", label: "회원정보" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  activeTab === tab.key
                    ? "bg-yellow-400 text-slate-950"
                    : "bg-slate-800 text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "profile" && (
            <>
              <div className="mb-6">
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="rounded-full bg-blue-500 px-5 py-2 text-sm font-bold text-white hover:bg-blue-400"
                >
                  회원정보 수정
                </button>
              </div>

              {editingProfile && (
                <div className="mb-8 rounded-2xl bg-slate-900 p-6 text-left">
                  <h2 className="mb-4 text-xl font-bold text-white">
                    회원정보 수정
                  </h2>

                  <div className="space-y-3">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="이름"
                      className="w-full rounded-lg bg-slate-800 p-3 text-white"
                    />

                    <input
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="휴대폰 번호"
                      className="w-full rounded-lg bg-slate-800 p-3 text-white"
                    />

                    <input
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="주소"
                      className="w-full rounded-lg bg-slate-800 p-3 text-white"
                    />

                    <button
                      onClick={saveProfile}
                      className="rounded-lg bg-green-500 px-5 py-3 font-bold text-white hover:bg-green-400"
                    >
                      저장하기
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => (window.location.href = "/reset-password")}
                className="mb-6 rounded-full bg-slate-700 px-6 py-3 font-bold text-white hover:bg-slate-600"
              >
                비밀번호 변경
              </button>
            </>
          )}
      {activeTab === "sky" && (
        <>
          <p className="mb-2 text-slate-300">
            별을 움직이고, 별 하나를 클릭한 뒤 다른 별을 클릭하면 선으로 연결돼요.
          </p>

          <p className="mb-4 text-sm text-slate-500">
            이미 연결된 별 두 개를 다시 순서대로 클릭하면 연결선이 삭제돼요.
          </p>

          <div className="mb-8 inline-block rounded-full bg-red-500 px-5 py-2 font-bold text-white">
            {getGrade(royalStars)}
          </div>

          <div
            ref={skyRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-3xl border border-blue-400/30 bg-[#020617] shadow-[0_0_40px_rgba(59,130,246,0.25)] select-none touch-none"
            >
            {totalStars >= 100 && totalStars < 500 && (
              <>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.28),transparent_25%),radial-gradient(circle_at_70%_35%,rgba(168,85,247,0.35),transparent_30%),radial-gradient(circle_at_50%_75%,rgba(236,72,153,0.18),transparent_35%)]" />

                <div className="pointer-events-none absolute left-[-20%] top-[42%] h-32 w-[145%] rotate-[-13deg] rounded-full bg-gradient-to-r from-transparent via-purple-400/35 to-transparent blur-2xl" />

                <div className="pointer-events-none absolute left-[-10%] top-[48%] h-16 w-[120%] rotate-[-13deg] rounded-full bg-gradient-to-r from-transparent via-blue-300/25 to-transparent blur-xl" />
              </>
            )}

            {totalStars >= 500 && totalStars < 1000 && (
              <>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.40),transparent_30%),radial-gradient(circle_at_70%_35%,rgba(168,85,247,0.50),transparent_35%),radial-gradient(circle_at_50%_75%,rgba(236,72,153,0.25),transparent_40%)]" />

                <div className="pointer-events-none absolute left-[-20%] top-[42%] h-40 w-[150%] rotate-[-13deg] rounded-full bg-gradient-to-r from-transparent via-purple-500/55 to-transparent blur-3xl" />

                <div className="pointer-events-none absolute left-[-10%] top-[48%] h-24 w-[130%] rotate-[-13deg] rounded-full bg-gradient-to-r from-transparent via-blue-400/35 to-transparent blur-2xl" />
              </>
            )}

            {totalStars >= 1000 && (
              <>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(250,204,21,0.20),transparent_30%),radial-gradient(ellipse_at_56%_46%,rgba(99,102,241,0.32),transparent_44%),radial-gradient(ellipse_at_72%_32%,rgba(168,85,247,0.36),transparent_42%),radial-gradient(circle_at_84%_72%,rgba(250,204,21,0.14),transparent_34%)]" />

                <div className="pointer-events-none absolute left-[-28%] top-[31%] h-56 w-[185%] rotate-[-13deg] rounded-full bg-gradient-to-r from-transparent via-blue-300/32 via-purple-300/42 to-transparent blur-3xl" />

                <div className="pointer-events-none absolute left-[-20%] top-[47%] h-32 w-[165%] rotate-[-13deg] rounded-full bg-gradient-to-r from-transparent via-violet-200/24 via-yellow-100/18 to-transparent blur-2xl" />

                <div className="pointer-events-none absolute left-[36%] top-[24%] h-52 w-52 rounded-full bg-purple-300/16 blur-3xl" />
                <div className="pointer-events-none absolute left-[63%] top-[28%] h-44 w-44 rounded-full bg-blue-300/14 blur-3xl" />
                <div className="pointer-events-none absolute left-[70%] top-[58%] h-36 w-36 rounded-full bg-yellow-200/12 blur-3xl" />

                {[
                  { left: "10%", top: "14%", size: "h-1.5 w-1.5", color: "bg-yellow-100", glow: "shadow-[0_0_18px_rgba(254,240,138,1)]", time: "2.1s" },
                  { left: "18%", top: "58%", size: "h-1 w-1", color: "bg-blue-100", glow: "shadow-[0_0_16px_rgba(191,219,254,1)]", time: "3.1s" },
                  { left: "30%", top: "30%", size: "h-1.5 w-1.5", color: "bg-white", glow: "shadow-[0_0_20px_rgba(255,255,255,1)]", time: "2.6s" },
                  { left: "41%", top: "22%", size: "h-1 w-1", color: "bg-purple-100", glow: "shadow-[0_0_17px_rgba(243,232,255,1)]", time: "3.4s" },
                  { left: "50%", top: "64%", size: "h-1.5 w-1.5", color: "bg-yellow-100", glow: "shadow-[0_0_20px_rgba(254,240,138,1)]", time: "2.4s" },
                  { left: "62%", top: "26%", size: "h-1 w-1", color: "bg-blue-100", glow: "shadow-[0_0_18px_rgba(191,219,254,1)]", time: "3.6s" },
                  { left: "72%", top: "52%", size: "h-1.5 w-1.5", color: "bg-white", glow: "shadow-[0_0_20px_rgba(255,255,255,1)]", time: "2.9s" },
                  { left: "83%", top: "35%", size: "h-1 w-1", color: "bg-purple-100", glow: "shadow-[0_0_18px_rgba(243,232,255,1)]", time: "3.2s" },
                  { left: "90%", top: "73%", size: "h-1 w-1", color: "bg-yellow-100", glow: "shadow-[0_0_18px_rgba(254,240,138,1)]", time: "2.8s" },
                  { left: "55%", top: "40%", size: "h-2 w-2", color: "bg-white", glow: "shadow-[0_0_24px_rgba(255,255,255,1)]", time: "2.2s" },
                  { left: "67%", top: "44%", size: "h-1 w-1", color: "bg-yellow-100", glow: "shadow-[0_0_18px_rgba(254,240,138,1)]", time: "3.8s" },
                  { left: "78%", top: "21%", size: "h-1.5 w-1.5", color: "bg-blue-100", glow: "shadow-[0_0_20px_rgba(191,219,254,1)]", time: "2.7s" },
                ].map((star, index) => (
                  <div
                    key={`master-point-${index}`}
                    className={`pointer-events-none absolute rounded-full ${star.size} ${star.color} ${star.glow}`}
                    style={{ left: star.left, top: star.top, animation: `twinkle ${star.time} infinite` }}
                  />
                ))}

                {[
                  { left: "23%", top: "23%" },
                  { left: "26%", top: "37%" },
                  { left: "34%", top: "50%" },
                  { left: "44%", top: "58%" },
                  { left: "59%", top: "35%" },
                  { left: "64%", top: "48%" },
                  { left: "76%", top: "40%" },
                  { left: "82%", top: "63%" },
                  { left: "88%", top: "54%" },
                  { left: "47%", top: "30%" },
                  { left: "70%", top: "70%" },
                  { left: "35%", top: "72%" },
                ].map((dust, index) => (
                  <div
                    key={`master-dust-${index}`}
                    className="pointer-events-none absolute h-0.5 w-0.5 rounded-full bg-yellow-100/80 shadow-[0_0_10px_rgba(254,240,138,0.9)]"
                    style={{ left: dust.left, top: dust.top }}
                  />
                ))}

                <div className="absolute right-5 top-5 z-40 animate-pulse rounded-full border border-yellow-300/70 bg-yellow-300/15 px-4 py-2 text-sm font-bold text-yellow-100 shadow-[0_0_34px_rgba(250,204,21,0.65)]">
                  👑 별자리 마스터
                  <div className="pointer-events-none absolute -right-1 -top-1 h-2 w-2 rounded-full bg-yellow-100 shadow-[0_0_16px_rgba(254,240,138,1)]" />
                  <div className="pointer-events-none absolute left-[15%] top-[30%] h-1 w-1 rounded-full bg-yellow-200 shadow-[0_0_12px_rgba(254,240,138,1)]" />
                  <div className="pointer-events-none absolute left-[42%] top-[18%] h-1 w-1 rounded-full bg-purple-200 shadow-[0_0_12px_rgba(216,180,254,1)]" />
                  <div className="pointer-events-none absolute left-[70%] top-[60%] h-1 w-1 rounded-full bg-blue-200 shadow-[0_0_12px_rgba(147,197,253,1)]" />
                  <div className="pointer-events-none absolute left-[82%] top-[32%] h-1 w-1 rounded-full bg-yellow-100 shadow-[0_0_12px_rgba(254,240,138,1)]" />
                </div>
              </>
            )}
            {shootingStars.map((star) => (
              <div
                key={star.id}
                className="shooting-star-random"
                style={
                  {
                    top: `${star.top}%`,
                    right: `${star.right}%`,
                    animationDuration: `${star.duration}s`,
                    "--move-x": `-${star.distanceX}px`,
                    "--move-y": `${star.distanceY}px`,
                  } as React.CSSProperties
                }
              />
            ))}
            {/* 작은 배경 별들 */}
            <div className="pointer-events-none absolute left-[12%] top-[18%] h-1 w-1 rounded-full bg-white shadow-[0_0_8px_white]" />
            <div className="pointer-events-none absolute left-[35%] top-[12%] h-1 w-1 rounded-full bg-blue-200 shadow-[0_0_10px_rgba(147,197,253,1)]" />
            <div className="pointer-events-none absolute left-[78%] top-[22%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_12px_white]" />
            <div className="pointer-events-none absolute left-[88%] top-[68%] h-1 w-1 rounded-full bg-purple-200 shadow-[0_0_10px_rgba(216,180,254,1)]" />
            <div className="pointer-events-none absolute left-[22%] top-[76%] h-1 w-1 rounded-full bg-yellow-100 shadow-[0_0_10px_rgba(254,240,138,1)]" />
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
              {connections.map((line, index) => {
                const from = getPositionByKey(line.from);
                const to = getPositionByKey(line.to);

                if (!from || !to) return null;

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

            {Array.from({ length: visibleStars }).map((_, index) => {
              const key = `small-${index}`;
              const position = getPosition(key, "small", index);
              const isSelected = selectedStar === key;

              return (
                <span
                  key={key}
                  onPointerDown={(e) => handlePointerDown(e, key)}
                  className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-grab text-[11px] active:cursor-grabbing ${
                    isSelected
                      ? "scale-150 drop-shadow-[0_0_14px_rgba(96,165,250,1)]"
                      : "drop-shadow-[0_0_10px_rgba(250,204,21,1)]"
                  }`}
                  style={{
                    top: `${position.top}%`,
                    left: `${position.left}%`,
                    animation: `twinkle ${2 + (index % 4)}s infinite`,
                  }}
                  >
                    ⭐
                  </span>
              );
            })}

            {Array.from({ length: visibleRoyalStars }).map((_, index) => {
              const key = `royal-${index}`;
              const position = getPosition(key, "royal", index);
              const isSelected = selectedStar === key;

              return (
                <span
                  key={key}
                  onPointerDown={(e) => handlePointerDown(e, key)}
                  className={`absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing ${
                    isSelected
                      ? "scale-125 drop-shadow-[0_0_20px_rgba(96,165,250,1)]"
                      : "drop-shadow-[0_0_14px_rgba(239,68,68,0.95)]"
                  }`}
                  style={{
                    top: `${position.top}%`,
                    left: `${position.left}%`,
                    animation: `twinkle ${2 + (index % 4)}s infinite`,
                  }}
                  >
                    <span className="relative flex h-10 w-10 items-center justify-center">
                      <span className="absolute h-12 w-12 rounded-full bg-amber-300/25 blur-xl" />
                      <span className="absolute h-8 w-8 rounded-full bg-yellow-400/20 blur-md" />
                      <span className="text-4xl text-yellow-300 drop-shadow-[0_0_18px_rgba(251,191,36,1)]">
                        ★
                      </span>
                    </span>
                  </span>
              );
            })}

            {visibleStars === 0 && visibleRoyalStars === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                아직 별이 없어요
              </div>
            )}
          </div>

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={resetStarPositions}
              className="rounded-full bg-slate-700 px-5 py-2 text-sm font-bold text-white hover:bg-slate-600"
            >
              별 위치 초기화
            </button>

            <button
              onClick={resetConnections}
              className="rounded-full bg-slate-700 px-5 py-2 text-sm font-bold text-white hover:bg-slate-600"
            >
              연결선 초기화
            </button>

            <button
              onClick={createShareLink}
              className="rounded-full bg-yellow-400 px-5 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-300"
            >
              별자리 공유 링크 만들기
            </button>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900 p-6">
              <p className="mb-2 text-slate-400">보유 별</p>
              <p className="text-4xl font-bold">⭐ {stars}개</p>
              <p className="mt-3 text-sm text-slate-400">
                교환에 사용할 수 있는 별
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900 p-6">
              <p className="mb-2 text-slate-400">누적 별</p>

              <p className="text-4xl font-bold">⭐ {totalStars}개</p>

              <p className="mt-3 text-sm text-slate-400">
                지금까지 모은 총 별 개수
              </p>

              <p className="mt-2 text-sm font-bold text-red-400">
                ★ 왕별 {royalStars}개
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-slate-900 p-5">
          {stars >= 40 ? (
            <>
              <p className="font-bold text-green-300">
                요거트 1L 교환이 가능합니다.
              </p>

              <p className="mt-2 text-xs text-slate-400">
                ※ 무료 교환 상품은 배송비가 별도 발생할 수 있습니다.
              </p>
            </>
          ) : (
              <p className="text-slate-300">
                다음 교환까지 별 {remainingStars}개 남았어요.
              </p>
            )}
          </div>

          <button
            onClick={exchangeYogurt}
            disabled={stars < 40 || processing}
            className={`mb-6 rounded-full px-6 py-3 font-bold ${
              stars >= 40 && !processing
                ? "bg-pink-400 text-slate-950 hover:bg-pink-300"
                : "bg-slate-700 text-slate-400 cursor-not-allowed"
            }`}
          >
            {processing ? "교환 신청 중..." : "요거트 1L 교환하기"}
          </button>
      
        </>
      )}

      {activeTab === "verify" && (
        <>
          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-left">
            <h2 className="mb-4 text-xl font-bold text-white">
              구매 인증 신청
            </h2>

            <div className="space-y-3">
              <input
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="스마트스토어 주문번호(끝4자리)"
                className="w-full rounded-lg bg-slate-800 p-3 text-white"
              />

              <select
                value={verifyProduct}
                onChange={(e) => setVerifyProduct(e.target.value)}
                className="w-full rounded-lg bg-slate-800 p-3 text-white"
              >
                <option value="">제품 선택</option>
                <option value="플레인 요거트 500ml">플레인 요거트 500ml</option>
                <option value="플레인 요거트 1L">플레인 요거트 1L</option>
                <option value="블루베리 요거트 500ml">블루베리 요거트 500ml</option>
                <option value="블루베리 요거트 1L">블루베리 요거트 1L</option>
              </select>

              <input
                type="number"
                value={verifyQuantity}
                onChange={(e) => setVerifyQuantity(Number(e.target.value))}
                placeholder="수량"
                className="w-full rounded-lg bg-slate-800 p-3 text-white"
              />

              <button
                onClick={submitVerification}
                className="rounded-lg bg-green-500 px-5 py-3 font-bold text-white hover:bg-green-400"
              >
                구매 인증 신청
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-left">
            <h2 className="mb-4 text-xl font-bold text-white">
              구매 인증 신청 내역
            </h2>

            {verifications.length === 0 ? (
              <p className="text-slate-400">
                구매 인증 신청 내역이 없습니다.
              </p>
            ) : (
              <div className="space-y-3">
                {verifications.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-bold">
                      주문번호 : {item.order_number}
                    </p>

                    <p className="text-sm text-slate-300">
                      제품 : {item.product_name}
                    </p>

                    <p className="text-sm text-slate-300">
                      수량 : {item.quantity}
                    </p>

                    <p
                      className={`font-bold ${
                        item.status === "approved"
                          ? "text-green-400"
                          : item.status === "rejected"
                          ? "text-red-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {item.status === "approved"
                        ? "승인완료"
                        : item.status === "rejected"
                        ? "반려"
                        : "승인대기"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}    

      {activeTab === "orders" && (    
          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-left">
            <h2 className="mb-4 text-xl font-bold text-white">구매 내역</h2>

            {orders.length === 0 ? (
              <p className="text-slate-400">아직 구매 내역이 없어요.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-bold text-white">{order.product_name}</p>

                    <p className="text-sm text-slate-300">
                      수량: {order.quantity}개
                    </p>

                    <p className="text-sm font-bold text-yellow-300">
                      적립 별: {order.stars_given}개
                    </p>

                    <p className="text-xs text-slate-500">
                      {new Date(order.created_at).toLocaleDateString("ko-KR")}
                    </p>
                    <p
                      className={`text-sm font-bold ${
                        order.status === "canceled"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {order.status === "canceled"
                        ? "주문취소"
                        : "주문완료"}
                    </p>
                    {order.status !== "canceled" && (
                      <button
                          onClick={() => cancelOrder(order.id)}
                          className="mt-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-red-400"
                      >
                          주문 취소
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
      )}  

      {activeTab === "rewards" && (
          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-left">
            <h2 className="mb-4 text-xl font-bold text-white">교환 신청 내역</h2>

            {requests.length === 0 ? (
              <p className="text-slate-400">아직 교환 신청 내역이 없어요.</p>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-bold text-white">{request.reward_name}</p>

                    <p className="text-sm text-slate-300">
                      별 {request.stars_used}개 사용
                    </p>

                    <p
                      className={`text-sm font-bold ${
                        request.status === "발송완료"
                          ? "text-green-300"
                          : "text-yellow-300"
                      }`}
                    >
                      {request.status}
                    </p>

                    <p className="text-xs text-slate-500">
                      {new Date(request.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
      )}

      {activeTab === "inquiries" && (
          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-left">
            <h2 className="mb-4 text-xl font-bold text-white">
              문의 내역
            </h2>
          
            {inquiries.length === 0 ? (
              <p className="text-slate-400">
                등록한 문의가 없습니다.
              </p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="font-bold text-white">
                      {item.title}
                    </p>
          
                    <p className="text-sm text-slate-300">
                      분류: {item.category}
                    </p>
          
                    <p className="mt-2 whitespace-pre-line text-slate-300">
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
          
                        <p className="mt-2 whitespace-pre-line text-white">
                          {item.answer}
                        </p>
                      </div>
                    )}
          
                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
      )}

        </div>
      </div>
    </main>
  );
}