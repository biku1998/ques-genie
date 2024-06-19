import { Link } from "react-router-dom";
import { Search, Home } from "lucide-react";
import BgPattern from "../assets/bg-pattern.svg";
import { Button } from "../components/ui/button";

export default function PageNotFound() {
  return (
    <>
      <main className="flex flex-col items-center justify-center relative min-h-screen">
        <img
          src={BgPattern}
          alt="background patter img"
          className="absolute top-0 -z-10"
          loading="eager"
        />
        <section className="flex flex-col items-center">
          <div className="h-[64px] w-[64px] rounded-full p-[9px] bg-blue-50">
            <div className="h-[46px] w-[46px] p-[9px] bg-blue-100 rounded-full">
              <Search size={28} className="text-blue-600" />
            </div>
          </div>
          <span className="mt-6 text-blue-600">404 error</span>
          <h1 className="mt-5 text-zinc-800 text-6xl font-bold">
            We can&apos;t find that page
          </h1>
          <p className="mt-3 text-xl text-zinc-500">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>

          <div className="flex items-center gap-4 mt-12">
            <Link to="/">
              <Button>
                <Home className="mr-2 h-4 w-4" /> Go Home
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
