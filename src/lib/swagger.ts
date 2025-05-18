import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "src/app/api", // your API routes folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Randomizer API",
        version: "1.0",
      },
      components: {
        schemas: {
          WordEntry: {
            type: "object",
            properties: {
              name: { type: "string" },
              category: { type: "string" },
              partOfSpeech: { type: "string" },
            },
            required: ["name"],
          },
          RandomColorResponse: {
            type: "object",
            properties: {
              color: { type: "string" },
              format: { type: "string", enum: ["hex", "rgba", "oklch"] },
            },
            required: ["color", "format"],
          },
          ColorPaletteResponse: {
            type: "object",
            properties: {
              palette: {
                type: "array",
                items: { type: "string" },
              },
              format: { type: "string", enum: ["hex", "rgba", "oklch"] },
            },
            required: ["palette", "format"],
          },
        },
      },
      security: [],
    },
  });
  return spec;
};
