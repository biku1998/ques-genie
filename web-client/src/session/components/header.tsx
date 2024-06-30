import { Link } from "react-router-dom";
import UserMenu from "../../components/user-menu";

export default function Header() {
  // bg-gradient-to-tr from-violet-100  to-blue-100
  return (
    <section className="max-w-5xl px-4 py-2  items-center flex justify-between w-full rounded-full bg-slate-50 border border-slate-200">
      <Link to="/">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-400 inline-block text-transparent bg-clip-text">
          QuesGenie
        </h1>
        <span className="text-2xl"> ✨</span>
      </Link>
      <UserMenu />
    </section>
  );
}
