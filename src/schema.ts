import { defineType, StringDefinition } from 'sanity';
import { SanityImageAssetDocument } from '@sanity/client';
import { MarkdocInput } from './components/MarkdocInput';

export const markdocTypeName = 'markdoc' as const

export interface MarkdocOptions {
  /**
   * Used to create image url for any uploaded image.
   * The function will be invoked whenever an image is pasted or dragged into the
   * markdoc editor, after upload completes.
   *
   * The default implementation uses
   * ```js
   * imageAsset => `${imageAsset.url}?w=450`
   * ```
   * ## Example
   * ```js
   * {
   *   imageUrl: imageAsset => `${imageAsset.url}?w=400&h=400`
   * }
   * ```
   * @param imageAsset
   */
  imageUrl?: (imageAsset: SanityImageAssetDocument) => string
}

/**
 * @public
 */
export interface MarkdocDefinition extends Omit<StringDefinition, 'type' | 'fields' | 'options'> {
  type: typeof markdocTypeName
  options?: MarkdocOptions
}

declare module '@sanity/types' {
  // makes type: 'markdoc' narrow correctly when using defineType/defineField/defineArrayMember
  export interface IntrinsicDefinitions {
    markdoc: MarkdocDefinition
  }
}

export const markdocSchemaType = defineType({
  type: 'string',
  name: markdocTypeName,
  title: 'Markdoc',
  components: {input: MarkdocInput},
})
