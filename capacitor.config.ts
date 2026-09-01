import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.digenty.axis",
  appName: "axis",
  webDir: "out",
  server: {
    url: "app.axisbydigenty.com",
    cleartext: false,
  },
};

export default config;
