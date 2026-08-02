export const AUTH_EXPIRED_EVENT = "auth:expired";

export const dispatchAuthExpired = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }
};
