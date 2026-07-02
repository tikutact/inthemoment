import PlanDetail from "@/components/PlanDetail";
import JsonLd from "@/components/JsonLd";
import { serviceLd, breadcrumb } from "@/lib/structured-data";
import { plans } from "../data";

export default function MoviePlanPage() {
  return (
    <>
      <JsonLd data={serviceLd(plans.movie)} />
      <JsonLd
        data={breadcrumb([
          { name: "ホーム", path: "/" },
          { name: "MOVIE プラン", path: "/plan/movie" },
        ])}
      />
      <PlanDetail plan={plans.movie} />
    </>
  );
}
