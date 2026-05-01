(function attachDlvStaticConfig(global) {
  "use strict";

  const location = global.location;
  const protocol = String(location?.protocol || "");
  const hostname = String(location?.hostname || "").toLowerCase();
  const port = String(location?.port || "");
  const params = new URLSearchParams(String(location?.search || ""));
  const forceStatic = params.get("static") === "1" || params.get("github") === "1";
  const forceBridge = params.get("bridge") === "1";
  const isHttp = protocol === "http:" || protocol === "https:";
  const isGithubPages = hostname.endsWith(".github.io");
  const isLoopback = (
    hostname === "localhost" ||
    hostname === "0.0.0.0" ||
    hostname === "::1" ||
    hostname === "[::1]" ||
    hostname.startsWith("127.")
  );

  // GitHub Pages is a static host: there is no Python bridge behind /api/*.
  // Keep the bridge enabled for local development and LAN access to port 8000.
  const hasLocalBridge = isHttp && !forceStatic && !isGithubPages && (isLoopback || port === "8000" || forceBridge);
  const origin = isHttp ? location.origin : "";

  global.DLV_STATIC = {
    isHttp,
    isGithubPages,
    isLoopback,
    forceStatic,
    hasLocalBridge,
    isStaticOnly: !hasLocalBridge,
    localOrdersApi: hasLocalBridge ? `${origin}/api/local-orders` : "",
    localEventsUrl: hasLocalBridge ? `${origin}/api/local-events` : "",
    menuAvailabilityApi: hasLocalBridge ? `${origin}/api/menu-availability` : ""
  };
})(window);
