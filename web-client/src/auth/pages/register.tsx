import { useNavigate } from "react-router-dom";
import { AuthSuccessResponse } from "../api";
import RegisterForm from "../components/register-form";
import { useUserStore } from "../user-store";

export default function RegisterPage() {
  const { setUser } = useUserStore();
  const navigate = useNavigate();

  const onRegister = (resp: AuthSuccessResponse) => {
    setUser({
      email: resp.user.email ?? "",
      id: resp.user.id,
    });
    navigate("/", { replace: true });
  };

  return (
    <main className="flex flex-col items-center relative gap-10">
      <section className="h-[234px] w-full bg-hero-section-bg flex flex-col items-center justify-center gap-10 group bg-repeat">
        <h1 className="text-2xl font-bold">QuesGenie ✨</h1>
        <p className="text-2xl font-medium text-slate-800 max-w-[623px] text-center">
          <span className="text-blue-700">Create Questions</span> that sparks
          curiosity from anything in minutes ⏳
        </p>
      </section>
      <RegisterForm onRegister={onRegister} />
    </main>
  );
}
