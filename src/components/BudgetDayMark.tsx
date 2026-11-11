import { Flower, Minus } from "lucide-react";
import type { DailyBudgetDay } from "@/lib/dailyBudget";

export const budgetDayLabel: Record<DailyBudgetDay["status"], string> = {
  achieved: "はなまる",
  over: "目標超過",
  pending: "判定前",
  unconfigured: "目標未設定",
  future: "予定",
};

export function BudgetDayMark({ status }: { status: DailyBudgetDay["status"] }) {
  if (status === "achieved") {
    return <Flower size={23} strokeWidth={1.9} className="text-[#a13e34]" aria-hidden="true" />;
  }
  if (status === "over") {
    return <Minus size={19} strokeWidth={2.5} className="text-[#815943]" aria-hidden="true" />;
  }
  if (status === "pending") {
    return <span className="h-2 w-2 rounded-full border border-[#a13e34]" aria-hidden="true" />;
  }
  return <span className="h-1 w-1 rounded-full bg-[#ccb8aa]" aria-hidden="true" />;
}
