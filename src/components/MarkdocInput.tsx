import 'easymde/dist/easymde.min.css';
import { debounce } from 'debounce';
import { Options as EasyMdeOptions } from 'easymde';
import { useCallback, useMemo } from 'react';
import SimpleMdeReact, { SimpleMDEReactProps } from 'react-simplemde-editor';
import { PatchEvent, set, StringInputProps, unset, useClient } from 'sanity';
import Markdoc from '@markdoc/markdoc';
import { heading } from '../markdoc-nodes/Heading.markdoc';
import { MarkdocOptions } from '../schema';
import { MarkdocInputStyles } from './MarkdocInputStyles';

export interface MarkdocInputProps extends StringInputProps {
  /**
   * These are passed along directly to
   *
   * Note: MarkdocInput sets certain reactMdeProps.options by default.
   * These will be merged with any custom options.
   * */
  reactMdeProps?: Omit<SimpleMDEReactProps, 'value' | 'onChange'>
}

export const defaultMdeTools: EasyMdeOptions['toolbar'] = [
  'heading',
  'bold',
  'italic',
  '|',
  'quote',
  'unordered-list',
  'ordered-list',
  '|',
  'link',
  'image',
  'code',
  '|',
  'preview',
  'side-by-side',
]

const MarkdocConfig = {
  nodes: {
    heading,
  },
}

export function MarkdocInput(props: MarkdocInputProps) {
  const {
    value = '',
    onChange,
    elementProps: {onBlur, onFocus, ref},
    reactMdeProps: {options: mdeCustomOptions, ...reactMdeProps} = {},
    schemaType,
  } = props

  const client = useClient({apiVersion: '2022-01-01'})
  const {imageUrl} = (schemaType.options as MarkdocOptions | undefined) ?? {}

  const imageUpload = useCallback(
    (file: File, onSuccess: (url: string) => void, onError: (error: string) => void) => {
      client.assets
        .upload('image', file)
        .then((doc) => onSuccess(imageUrl ? imageUrl(doc) : `${doc.url}?w=450`))
        .catch((e) => {
          console.error(e)
          onError(e.message)
        })
    },
    [client, imageUrl]
  )

  const mdeOptions: EasyMdeOptions = useMemo(() => {
    return {
      autofocus: false,
      spellChecker: false,
      sideBySideFullscreen: false,
      uploadImage: true,
      imageUploadFunction: imageUpload,
      toolbar: defaultMdeTools,
      status: false,
      ...mdeCustomOptions,
    }
  }, [imageUpload, mdeCustomOptions])

  const handleChange = useCallback(
    (newValue: string) => {
      const ast = Markdoc.parse(newValue)
      const content = Markdoc.transform(ast, MarkdocConfig)
      const htmlValue = Markdoc.renderers.html(content)
      onChange(PatchEvent.from(htmlValue ? set(htmlValue) : unset()))
    },
    [onChange]
  )

  return (
    <MarkdocInputStyles>
      <SimpleMdeReact
        {...reactMdeProps}
        ref={ref}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        onFocus={onFocus}
        options={mdeOptions}
        spellCheck={false}
      />
    </MarkdocInputStyles>
  )
}
