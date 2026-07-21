"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FunctionsHttpError } from "@supabase/supabase-js";
import AppHeader from "@/components/AppHeader";
import type { ExploreTripSettings } from "@/lib/explore";
import { supabase } from "@/lib/supabase";
import { normalizeTripCoverImages } from "@/lib/trip-cover";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExploreSettingsModal from "../components/ExploreSettingsModal";
import ShareTripCard from "../components/ShareTripCard";
import TripHeaderCard from "../components/TripHeaderCard";
import TripVisibilityCard from "../components/TripVisibilityCard";

type Trip = {
  id: string;
  title: string;
  destination: string;
  area: string;
  start_date: string;
  end_date: string;
  total_cost: number;
  is_public: boolean;
  user_id: string;
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
  initialUserName: string;
  initialTrip: Trip;
  initialParticipants: Participant[];
  initialExpenses: Expense[];
  initialMembers: Member[];
};

export default function TripDetailPresentation({
  tripId,
  userId,
  initialUserName,
  initialTrip,
  initialParticipants,
  initialExpenses,
  initialMembers,
}: Props) {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip>(() => normalizeTrip(initialTrip));
  const [participants, setParticipants] =
    useState<Participant[]>(initialParticipants);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [shareError, setShareError] = useState("");
  const [showExploreSettings, setShowExploreSettings] = useState(false);

  const isOwner = trip.user_id === userId;

  const refresh = async () => {
    const [
      { data: tripData },
      { data: expensesData },
      { data: participantsData },
      { data: membersData },
    ] = await Promise.all([
      supabase.from("trips").select("*").eq("id", tripId).single(),
      supabase
        .from("expenses")
        .select("*")
        .eq("trip_id", tripId)
        .order("category"),
      supabase
        .from("participants")
        .select("*")
        .eq("trip_id", tripId)
        .order("created_at"),
      supabase
        .from("trip_members")
        .select("*, users(name, email)")
        .eq("trip_id", tripId)
        .order("created_at"),
    ]);
    if (tripData) setTrip(normalizeTrip(tripData as Trip));
    setExpenses(expensesData ?? []);
    setParticipants(participantsData ?? []);
    setMembers(membersData ?? []);
  };

  useEffect(() => {
    const channel = supabase
      .channel(`trip-${tripId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "expenses",
          filter: `trip_id=eq.${tripId}`,
        },
        refresh,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
          filter: `trip_id=eq.${tripId}`,
        },
        refresh,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trips",
          filter: `id=eq.${tripId}`,
        },
        refresh,
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trip_members",
          filter: `trip_id=eq.${tripId}`,
        },
        refresh,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const handleDeleteExpense = async (expenseId: string) => {
    await supabase.from("expenses").delete().eq("id", expenseId);
    await refresh();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleShare = async (email: string) => {
    setShareError("");
    const { data, error } = await supabase.functions.invoke(
      "share-trip-invite",
      {
        body: { tripId, email },
      },
    );
    if (error) {
      let message = error.message;
      if (error instanceof FunctionsHttpError) {
        try {
          const body = await error.context.json();
          message = body?.debug
            ? JSON.stringify(body)
            : (body?.error ?? message);
        } catch {
          // レスポンスボディがJSONでない場合は元のメッセージのまま
        }
      }
      setShareError(message);
      return;
    }
    if (data?.error) {
      setShareError(data?.debug ? JSON.stringify(data) : data.error);
      return;
    }
    await refresh();
  };

  const handleRemoveMember = async (memberId: string) => {
    await supabase.from("trip_members").delete().eq("id", memberId);
    await refresh();
  };

  const handleExploreSettingsSaved = (settings: ExploreTripSettings) => {
    setTrip((currentTrip) => ({
      ...currentTrip,
      ...settings,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader userName={initialUserName} onLogout={handleLogout} />

      <main className="max-w-[800px] mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 no-underline mb-6"
        >
          ← 旅行一覧へ戻る
        </Link>

        <TripHeaderCard
          trip={trip}
          participants={participants}
          expenses={expenses}
        />
        {isOwner && (
          <TripVisibilityCard
            isPublic={trip.is_public}
            coverImages={trip.cover_images}
            travelStyle={trip.travel_style}
            themes={trip.themes}
            onEdit={() => setShowExploreSettings(true)}
          />
        )}
        <ShareTripCard
          members={members}
          isOwner={isOwner}
          shareError={shareError}
          onShare={handleShare}
          onRemoveMember={handleRemoveMember}
        />
        <ExpenseForm
          tripId={tripId}
          participants={participants}
          onAdded={refresh}
        />
        <ExpenseList
          expenses={expenses}
          participants={participants}
          onDelete={handleDeleteExpense}
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
          onClose={() => setShowExploreSettings(false)}
          onSaved={handleExploreSettingsSaved}
        />
      )}
    </div>
  );
}

function normalizeTrip(trip: Trip): Trip {
  return {
    ...trip,
    cover_images: normalizeTripCoverImages(trip.cover_images, {
      image_url: trip.cover_image_url ?? "",
      cover_image_fit: trip.cover_image_fit,
      cover_image_zoom: Number(trip.cover_image_zoom),
      cover_image_position_x: trip.cover_image_position_x,
      cover_image_position_y: trip.cover_image_position_y,
    }),
  };
}
