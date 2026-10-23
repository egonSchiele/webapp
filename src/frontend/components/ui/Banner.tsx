import { BannerLevel } from "@/frontend/types.js";
import { cls } from "@/common/util.js";

export default function Banner({
  level,
  message,
}: {
  level: BannerLevel;
  message: string;
}) {
  const bannerClassName = {
    info: "banner-info",
    error: "banner-error",
  }[level];
  return <div className={cls(bannerClassName)}>{message}</div>;
}
