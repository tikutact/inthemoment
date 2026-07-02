import PlanDetail from "@/components/PlanDetail";
import JsonLd from "@/components/JsonLd";
import { serviceLd, breadcrumb } from "@/lib/structured-data";
import { plans, planMetadata } from "../data";

export const metadata = planMetadata(plans.photo);

export default function PhotoPlanPage() {
  return (
    <>
      <JsonLd data={serviceLd(plans.photo)} />
      <JsonLd
        data={breadcrumb([
          { name: "ホーム", path: "/" },
          { name: "PHOTO プラン", path: "/plan/photo" },
        ])}
      />
      <PlanDetail plan={plans.photo} />
    </>
  );
}
