export interface TimeState {
  greeting: string;
  subtext: string;
  icon: string;
  isNight: boolean;
  period: "morning" | "afternoon" | "evening" | "night";
}

export function getTimeState(hourOverride?: number): TimeState {
  const hour = hourOverride ?? new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      greeting: "Good Morning 🌸",
      subtext: "Ready to conquer the day,",
      icon: "🌅",
      isNight: false,
      period: "morning",
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: "Good Afternoon ☀️",
      subtext: "Keep up the great momentum,",
      icon: "☀️",
      isNight: false,
      period: "afternoon",
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: "Good Evening 🌇",
      subtext: "Hope you had a wonderful day,",
      icon: "🌆",
      isNight: false,
      period: "evening",
    };
  } else {
    return {
      greeting: "Good Night 🌙",
      subtext: "Time to rest & restore your energy,",
      icon: "✨",
      isNight: true,
      period: "night",
    };
  }
}
