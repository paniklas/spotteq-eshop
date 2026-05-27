import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { presentationTool } from 'sanity/presentation';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';
import { apiVersion, dataset, projectId } from './sanity/env';

export default defineConfig({
  basePath: '/studio-spotteq',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    internationalizedArray({
      languages: [
        { id: 'en', title: 'English' },
        { id: 'el', title: 'Greek' },
      ],
      defaultLanguage: 'el',
      fieldTypes: ['string', 'text', 'blockContent'],
    }),
  ],
})
