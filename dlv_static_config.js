(function attachDlvStaticConfig(global) {
  "use strict";

  const location = global.location;
  const protocol = String(location?.protocol || "");
  const hostname = String(location?.hostname || "").toLowerCase();
  const port = String(location?.port || "");
  const params = new URLSearchParams(String(location?.search || ""));
  const storageKey = "DLV_REMOTE_BRIDGE_URL";
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

  function safeStorageGet(key) {
    try {
      return String(global.localStorage?.getItem(key) || "");
    } catch (_) {
      return "";
    }
  }

  function safeStorageSet(key, value) {
    try {
      if (!global.localStorage) return;
      if (value) {
        global.localStorage.setItem(key, value);
      } else {
        global.localStorage.removeItem(key);
      }
    } catch (_) {
      // Ignore storage errors in private / restricted contexts.
    }
  }

  function normalizeBridgeBase(rawValue) {
    const raw = String(rawValue || "").trim();
    if (!raw) return "";
    try {
      const url = new URL(raw, isHttp ? location.href : undefined);
      if (url.protocol !== "http:" && url.protocol !== "https:") return "";
      return url.origin + url.pathname.replace(/\/+$/, "");
    } catch (_) {
      return "";
    }
  }

  const origin = isHttp ? location.origin : "";
  const paramBridgeBase = normalizeBridgeBase(
    params.get("bridgeUrl") ||
    params.get("bridge_url") ||
    params.get("remoteBridge") ||
    params.get("remote_bridge")
  );
  const explicitBridgeBase = normalizeBridgeBase(global.DLV_REMOTE_BRIDGE_URL || "");
  const storedBridgeBase = normalizeBridgeBase(safeStorageGet(storageKey));
  if (paramBridgeBase) {
    safeStorageSet(storageKey, paramBridgeBase);
  } else if (params.get("bridgeUrl") === "" || params.get("bridge_url") === "" || params.get("bridge") === "0") {
    safeStorageSet(storageKey, "");
  }

  const sameOriginBridgeBase = isHttp && !forceStatic && !isGithubPages ? origin : "";
  const bridgeBase =
    forceStatic ? "" :
    paramBridgeBase ||
    explicitBridgeBase ||
    storedBridgeBase ||
    sameOriginBridgeBase ||
    (forceBridge && origin ? origin : "");
  const hasLocalBridge = Boolean(bridgeBase);

  global.DLV_STATIC = {
    isHttp,
    isGithubPages,
    isLoopback,
    forceStatic,
    bridgeBase,
    hasLocalBridge,
    isStaticOnly: !hasLocalBridge,
    localOrdersApi: hasLocalBridge ? `${bridgeBase}/api/local-orders` : "",
    localEventsUrl: hasLocalBridge ? `${bridgeBase}/api/local-events` : "",
    menuAvailabilityApi: hasLocalBridge ? `${bridgeBase}/api/menu-availability` : "",
    remoteBridgeStorageKey: storageKey,
    setBridgeBase(nextBridgeBase) {
      const normalized = normalizeBridgeBase(nextBridgeBase);
      safeStorageSet(storageKey, normalized);
      return normalized;
    },
    clearBridgeBase() {
      safeStorageSet(storageKey, "");
    }
  };
})(window);
