import { NextResponse } from "next/server";

export async function GET() {
  // Get userId parameter
  const dailyMissions = [
    {
      id: 0,
      missionName: "Popcorn Party",
    },
    {
      id: 1,
      missionName: "Win A game",
    },
    {
      id: 2,
      missionName: "X",
    },
    {
      id: 3,
      rewardName: "Y",
    },
  ];

  // If the user is found, return it as a JSON response
  return NextResponse.json(dailyMissions, { status: 200 });
}
