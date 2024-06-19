import React from "react";
import SmallScreenMessage from "./small-screen-message";

export default function DisableSmallScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const [width, setWidth] = React.useState<number>(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 1000;
  if (isMobile) return <SmallScreenMessage />;
  return children;
}
