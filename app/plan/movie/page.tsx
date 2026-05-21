import PlanDetail from "@/components/PlanDetail";
import { plans } from "../data";

export default function MoviePlanPage() {
  return <PlanDetail plan={plans.movie} />;
}
