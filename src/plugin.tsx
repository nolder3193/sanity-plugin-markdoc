import { ReactElement } from 'react';
import { definePlugin, StringInputProps } from 'sanity';
import { markdocSchemaType } from './schema';

export interface MarkdocConfig {
  input?: (props: StringInputProps) => ReactElement
}

export const markdocSchema = definePlugin((config: MarkdocConfig | void) => {
  return {
    name: 'markdoc-editor',
    schema: {
      types: [
        config && config.input
          ? {...markdocSchemaType, components: {input: config.input}}
          : markdocSchemaType,
      ],
    },
  }
})
