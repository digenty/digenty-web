import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: "./openapi.yaml", // or URL
    output: {
      target: "./src/api/generated.ts",
      schemas: "./src/api/models",
      client: "react-query",
      httpClient: "axios",
      override: {
        axios: {
          instancePath: "@/lib/axios",
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
