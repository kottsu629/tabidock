"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AppHeader from "@/components/AppHeader";
import NewTripModal from "@/components/NewTripModal";
import Modal from "@/components/Modal";
import TripCard from "@/components/TripCard";

type Trip = {
  id: string;
  title: string;
  destination: string;
  area: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  is_public: boolean;
  participants: { count: number }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Trip | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTrips = async (uid: string) => {
    const { data } = await supabase
      .from("trips")
      .select("*, participants(count)")
      .eq("user_id", uid)
      .order("start_date", { ascending: false });
    if (data) setTrips(data);
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
      const { data: userData } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();
      if (userData) setUserName(userData.name);
      await fetchTrips(user.id);
      setLoading(false);
    };
    init();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from("trips").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    await fetchTrips(userId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-400 text-[0.9rem]">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader userName={userName} onLogout={handleLogout} />

      <main className="max-w-[1200px] mx-auto px-6 py-8">
        {/* ページタイトル + 追加ボタン */}
        <div className="flex justify-between items-center mb-7">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 m-0">旅行記録</h1>
            <p className="text-sm text-slate-500 mt-1">
              {trips.length > 0
                ? `${trips.length}件の旅行`
                : "旅行を追加してみましょう"}
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="bg-indigo-500 text-white border-none rounded-[10px] py-[10px] px-5 text-sm font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-indigo-600 transition-colors"
          >
            <span className="text-base">+</span> 旅行を追加
          </button>
        </div>

        {/* 旅行一覧 */}
        {trips.length === 0 ? (
          <div className="text-center py-20 px-5 bg-white rounded-2xl border border-slate-200">
            <div className="text-5xl mb-4">✈️</div>
            <p className="text-base text-slate-700 font-semibold mb-1.5">
              旅行がまだ登録されていません
            </p>
            <p className="text-sm text-slate-400">
              「旅行を追加」から最初の旅行を記録しましょう
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </main>

      {/* 旅行追加モーダル */}
      {showNewModal && (
        <NewTripModal
          userId={userId}
          onClose={() => setShowNewModal(false)}
          onCreated={() => fetchTrips(userId)}
        />
      )}

      {/* 削除確認モーダル */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div className="p-8">
            <div className="text-[2.5rem] text-center mb-4">🗑️</div>
            <h3 className="text-[1.1rem] font-bold text-slate-900 text-center mb-2">
              旅行を削除しますか？
            </h3>
            <p className="text-sm text-slate-500 text-center mb-1.5">
              「{deleteTarget.title}」
            </p>
            <p className="text-[0.8rem] text-slate-400 text-center mb-7">
              費用データも含めてすべて削除されます。この操作は取り消せません。
            </p>
            <div className="flex gap-[10px]">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-[10px] rounded-[10px] border border-slate-200 bg-white text-gray-700 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-[10px] rounded-[10px] border-none bg-red-500 text-white text-sm font-semibold cursor-pointer disabled:opacity-60 hover:bg-red-600 transition-colors"
              >
                {deleting ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
