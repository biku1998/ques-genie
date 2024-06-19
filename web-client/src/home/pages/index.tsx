import { Search } from "lucide-react";
import HeroSection from "../../components/hero-section";
import { Input } from "../../components/ui/input";
import CreateSessionDialog from "../components/create-session-dialog";
import SessionCard from "../components/session-card";
import { useFetchSessions } from "../queries";

export default function HomePage() {
  const fetchSessionsQuery = useFetchSessions();
  return (
    <>
      <main className="flex flex-col gap-7 pb-10">
        <HeroSection />
        <section className="w-full">
          <div className="max-w-5xl mx-auto flex flex-col gap-14">
            <div className="flex items-center">
              <div className="relative w-[400px]">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-14 w-full">
              <CreateSessionDialog />
              {fetchSessionsQuery.data
                ? fetchSessionsQuery.data.map((sessionPayload) => (
                    <SessionCard key={sessionPayload.id} {...sessionPayload} />
                  ))
                : null}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
