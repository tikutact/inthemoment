import PlanDetail from "@/components/PlanDetail";
import JsonLd from "@/components/JsonLd";
import { serviceLd, breadcrumb } from "@/lib/structured-data";
import { plans } from "../data";

export default function PhotoMoviePlanPage() {
  return (
    <>
      <JsonLd data={serviceLd(plans["photo-movie"])} />
      <JsonLd
        data={breadcrumb([
          { name: "ホーム", path: "/" },
          { name: "PHOTO + MOVIE プラン", path: "/plan/photo-movie" },
        ])}
      />
      <PlanDetail plan={plans["photo-movie"]} />
    </>
  );
}
