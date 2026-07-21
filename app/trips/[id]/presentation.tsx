import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import TripHeaderCard from "@/components/TripHeaderCard";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ShareTripCard from "@/components/ShareTripCard";
import TripVisibilityCard from "@/components/TripVisibilityCard";
import ExploreSettingsModal from "@/components/ExploreSettingsModal";
import type { ExploreTripSettings } from "@/lib/explore";

type Trip = {
  id: string;
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
  cover_images: ExploreTripSettings["cover_images"];
  travel_style: string | null;
  themes: string[];
};

type Participant = {
  id: string;
  trip_id: string;
  name: string;
};

type Expense = {
  id: string;
  category: string;
  title: string;
  amount: number;
  participant_id: string | null;
};

type Member = {
  id: string;
  user_id: string;
  users: { name: string; email: string | null } | null;
};

type Props = {
  tripId: string;
  userId: string;
  userName: string;
  trip: Trip;
  participants: Participant[];
  expenses: Expense[];
  members: Member[];
  isOwner: boolean;
  shareError: string;
  showExploreSettings: boolean;
  onLogout: () => void;
  onOpenExploreSettings: () => void;
  onCloseExploreSettings: () => void;
  onExploreSettingsSaved: (settings: ExploreTripSettings) => void;
  onExpenseAdded: () => void;
  onDeleteExpense: (expenseId: string) => void;
  onShare: (email: string) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
};

export default function TripDetailPresentation({
  tripId,
  userId,
  userName,
  trip,
  participants,
  expenses,
  members,
  isOwner,
  shareError,
  showExploreSettings,
  onLogout,
  onOpenExploreSettings,
  onCloseExploreSettings,
  onExploreSettingsSaved,
  onExpenseAdded,
  onDeleteExpense,
  onShare,
  onRemoveMember,
}: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader userName={userName} onLogout={onLogout} />

      <main className="max-w-[800px] mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 no-underline mb-6"
        >
          ← 旅行一覧へ戻る
        </Link>

        <TripHeaderCard trip={trip} participants={participants} expenses={expenses} />
        {isOwner && (
          <TripVisibilityCard
            isPublic={trip.is_public}
            coverImages={trip.cover_images}
            travelStyle={trip.travel_style}
            themes={trip.themes}
            onEdit={onOpenExploreSettings}
          />
        )}
        <ShareTripCard
          members={members}
          isOwner={isOwner}
          shareError={shareError}
          onShare={onShare}
          onRemoveMember={onRemoveMember}
        />
        <ExpenseForm tripId={tripId} participants={participants} onAdded={onExpenseAdded} />
        <ExpenseList
          expenses={expenses}
          participants={participants}
          onDelete={onDeleteExpense}
        />
      </main>

      {showExploreSettings && (
        <ExploreSettingsModal
          tripId={tripId}
          userId={userId}
          initialSettings={{
            cover_images: trip.cover_images,
            cover_image_url: trip.cover_image_url,
            cover_image_fit: trip.cover_image_fit,
            cover_image_zoom: trip.cover_image_zoom,
            cover_image_position_x: trip.cover_image_position_x,
            cover_image_position_y: trip.cover_image_position_y,
            travel_style: trip.travel_style,
            themes: trip.themes,
            is_public: trip.is_public,
          }}
          onClose={onCloseExploreSettings}
          onSaved={onExploreSettingsSaved}
        />
      )}
    </div>
  );
}
