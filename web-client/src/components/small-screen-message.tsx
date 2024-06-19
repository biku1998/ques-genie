import SmallScreenMsgImg from "../assets/small-screen-message.svg";

export default function SmallScreenMessage() {
  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center">
      <img
        src={SmallScreenMsgImg}
        alt="mobile view message"
        className="h-[187px] w-[319px] object-cover"
      />
    </main>
  );
}
