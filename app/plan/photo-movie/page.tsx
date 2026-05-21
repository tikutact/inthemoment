import PlanDetail from "@/components/PlanDetail";
import { plans } from "../data";

export default function PhotoMoviePlanPage() {
  return <PlanDetail plan={plans["photo-movie"]} />;
}
