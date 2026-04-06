export const initAgora = async () => {
  const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
  AgoraRTC.setLogLevel(0);
  return AgoraRTC;
};