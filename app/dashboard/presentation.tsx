import AppHeader from "@/components/AppHeader";
import NewTripModal from "@/components/NewTripModal";
import Modal from "@/components/Modal";
import TripCard from "@/components/TripCard";
import SiteIcon from "@/components/SiteIcon";

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
  participants: { count: number }[];
};

type Props = {
  userId: string;
  userName: string;
  trips: Trip[];
  showNewModal: boolean;
  deleteTarget: Trip | null;
  deleting: boolean;
  onLogout: () => void;
  onAddClick: () => void;
  onCloseNewModal: () => void;
  onTripCreated: () => void;
  onDeleteClick: (trip: Trip) => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
};

export default function DashboardPresentation({
  userId,
  userName,
  trips,
  showNewModal,
  deleteTarget,
  deleting,
  onLogout,
  onAddClick,
  onCloseNewModal,
  onTripCreated,
  onDeleteClick,
  onCancelDelete,
  onConfirmDelete,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader userName={userName} onLogout={onLogout} />

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
            onClick={onAddClick}
            className="bg-indigo-500 text-white border-none rounded-[10px] py-[10px] px-5 text-sm font-semibold cursor-pointer flex items-center gap-1.5 hover:bg-indigo-600 transition-colors"
          >
            <span className="text-base">+</span> 旅行を追加
          </button>
        </div>

        {/* 旅行一覧 */}
        {trips.length === 0 ? (
          <div className="text-center py-20 px-5 bg-[#fffdf8] rounded-2xl border border-slate-200">
            <SiteIcon name="plane" className="size-10 mx-auto mb-4 text-indigo-500" />
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
              <TripCard key={trip.id} trip={trip} userId={userId} onDelete={onDeleteClick} />
            ))}
          </div>
        )}
      </main>

      {/* 旅行追加モーダル */}
      {showNewModal && (
        <NewTripModal
          userId={userId}
          onClose={onCloseNewModal}
          onCreated={onTripCreated}
        />
      )}

      {/* 削除確認モーダル */}
      {deleteTarget && (
        <Modal onClose={onCancelDelete}>
          <div className="p-8">
            <SiteIcon name="trash" className="size-9 mx-auto mb-4 text-red-500" />
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
                onClick={onCancelDelete}
                className="flex-1 py-[10px] rounded-[10px] border border-slate-200 bg-white text-gray-700 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={onConfirmDelete}
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
