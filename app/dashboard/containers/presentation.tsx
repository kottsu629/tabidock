"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Modal from "@/components/Modal";
import SiteIcon from "@/components/SiteIcon";
import { supabase } from "@/lib/supabase";
import {
  getOwnedTripCoverStoragePath,
  normalizeTripCoverImages,
  TRIP_COVER_BUCKET,
} from "@/lib/trip-cover";
import NewTripModal from "../components/NewTripModal";
import TripCard from "../components/TripCard";

type Trip = {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  area: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  is_public: boolean;
  cover_image_url: string | null;
  cover_image_fit: "cover" | "contain";
  cover_image_zoom: number;
  cover_image_position_x: number;
  cover_image_position_y: number;
  cover_images: unknown;
  participants: { count: number }[];
};

type Props = {
  userId: string;
  initialUserName: string;
  initialTrips: Trip[];
};

export default function DashboardPresentation({
  userId,
  initialUserName,
  initialTrips,
}: Props) {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [showNewModal, setShowNewModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Trip | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTrips = async () => {
    const { data: memberRows } = await supabase
      .from("trip_members")
      .select("trip_id")
      .eq("user_id", userId);
    const memberTripIds = (memberRows ?? []).map((row) => row.trip_id);

    const tripsQuery = supabase
      .from("trips")
      .select("*, participants(count)")
      .order("start_date", { ascending: false });

    const { data } =
      memberTripIds.length > 0
        ? await tripsQuery.or(
            `user_id.eq.${userId},id.in.(${memberTripIds.join(",")})`,
          )
        : await tripsQuery.eq("user_id", userId);
    if (data) setTrips(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await supabase
      .from("trips")
      .delete()
      .eq("id", deleteTarget.id);
    if (!error) {
      const coverStoragePaths = normalizeTripCoverImages(
        deleteTarget.cover_images,
        {
          image_url: deleteTarget.cover_image_url ?? "",
          cover_image_fit: deleteTarget.cover_image_fit,
          cover_image_zoom: Number(deleteTarget.cover_image_zoom),
          cover_image_position_x: deleteTarget.cover_image_position_x,
          cover_image_position_y: deleteTarget.cover_image_position_y,
        },
      ).flatMap((image) => {
        const path = getOwnedTripCoverStoragePath(
          image.image_url,
          userId,
          deleteTarget.id,
        );
        return path ? [path] : [];
      });
      if (coverStoragePaths.length > 0) {
        await supabase.storage
          .from(TRIP_COVER_BUCKET)
          .remove(Array.from(new Set(coverStoragePaths)));
      }
    }
    setDeleting(false);
    setDeleteTarget(null);
    await fetchTrips();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader userName={initialUserName} onLogout={handleLogout} />

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
          <div className="text-center py-20 px-5 bg-[#fffdf8] rounded-2xl border border-slate-200">
            <SiteIcon
              name="plane"
              className="size-10 mx-auto mb-4 text-indigo-500"
            />
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
                userId={userId}
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
          onCreated={fetchTrips}
        />
      )}

      {/* 削除確認モーダル */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <div className="p-8">
            <SiteIcon
              name="trash"
              className="size-9 mx-auto mb-4 text-red-500"
            />
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
                onClick={handleConfirmDelete}
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
