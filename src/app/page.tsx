import { LandingPage } from "@/components/home/landing-page";
import { getLevelSummaries } from "@/lib/course-queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const levels = await getLevelSummaries();

  return <LandingPage levels={levels} />;
}
