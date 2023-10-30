import { Client, isFullBlock, iteratePaginatedAPI } from '@notionhq/client';
import {
  type BlockObjectResponse,
  type PartialBlockObjectResponse,
  type RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { type MaybeLiteral } from '~/lib/utils';

import { baseUrl } from './url';

type ContentBlock = PartialBlockObjectResponse | BlockObjectResponse;

type Level = {
  level: number;
};

type IterateFullContentResult = {
  count: number;
};

/**
 * Interleave full content by recursive fetching
 * @param pageId
 */
export async function* interleaveFullContent(
  client: Client,
  pageId: string,
  level = 0,
): AsyncGenerator<ContentBlock & Level, IterateFullContentResult> {
  let count = 0;

  for await (const childBlock of iteratePaginatedAPI(client.blocks.children.list, { block_id: pageId })) {
    if (isFullBlock(childBlock) && childBlock.has_children) {
      yield { ...childBlock, level };
      // interleaving children to make full content to be flatten
      if (childBlock.type === 'heading_1' || childBlock.type === 'heading_2' || childBlock.type === 'heading_3') {
        // reset indentation by heading
        yield* interleaveFullContent(client, childBlock.id, 0);
      } else {
        yield* interleaveFullContent(client, childBlock.id, level + 1);
      }
    } else {
      yield { ...childBlock, level };
    }
    count++;
  }

  return { count };
}

/**
 * Convert notion content blocks into Markdown(GFM) text.
 *
 * @param blocks content blocks
 * @returns content formatted in GFM
 */
export function blocksToMarkdown(blocks: Array<ContentBlock & Level>): string {
  let content = '';

  let prevType: MaybeLiteral<BlockObjectResponse['type']> = '';
  let tableHeader = false;

  for (const block of blocks) {
    if (isFullBlock(block)) {
      // detect end of group
      if (block.type !== prevType) {
        if (prevType === 'bulleted_list_item' || prevType === 'numbered_list_item' || prevType === 'to_do') {
          // end list group
          content += '\n';
        }
        if (prevType === 'table_row') {
          // end table group
          tableHeader = false;
          content += '\n';
        }
      }

      switch (block.type) {
        case 'heading_1': {
          content += `# ${block.heading_1.rich_text.map(richTextToMarkdown).reduce(mergeMarkdownInline)}`;
          content += '\n\n';
          break;
        }
        case 'heading_2': {
          content += `## ${block.heading_2.rich_text.map(richTextToMarkdown).reduce(mergeMarkdownInline)}`;
          content += '\n\n';
          break;
        }
        case 'heading_3': {
          content += `### ${block.heading_3.rich_text.map(richTextToMarkdown).reduce(mergeMarkdownInline)}`;
          content += '\n\n';
          break;
        }
        case 'paragraph': {
          if (block.paragraph.rich_text.length > 0) {
            content += indent(
              block.level,
              block.paragraph.rich_text.map(richTextToMarkdown).reduce(mergeMarkdownInline),
            );
            content += '\n\n';
          }
          break;
        }
        case 'bulleted_list_item': {
          if (block.bulleted_list_item.rich_text.length > 0) {
            content += indent(
              block.level,
              `- ${block.bulleted_list_item.rich_text.map(richTextToMarkdown).reduce(mergeMarkdownInline)}`,
            );
            content += '\n';
          }
          break;
        }
        case 'numbered_list_item': {
          if (block.numbered_list_item.rich_text.length > 0) {
            content += indent(
              block.level,
              `1. ${block.numbered_list_item.rich_text.map(richTextToMarkdown).reduce(mergeMarkdownInline)},
          `,
            );
            content += '\n';
          }
          break;
        }
        case 'to_do': {
          if (block.to_do.rich_text.length > 0) {
            const mark = block.to_do.checked ? 'x' : ' ';
            content += indent(
              block.level,
              `- [${mark}] ${block.to_do.rich_text.map(richTextToMarkdown).reduce(mergeMarkdownInline)}`,
            );
            content += '\n';
          }
          break;
        }
        case 'quote': {
          if (block.quote.rich_text.length > 0) {
            content += indent(
              block.level,
              mdQuote(block.quote.rich_text.map(richTextToMarkdown).reduce(mergeMarkdownInline)),
            );
            content += '\n\n';
          }
          break;
        }
        case 'callout': {
          if (block.callout.rich_text.length > 0) {
            content += indent(
              block.level,
              htmlWrap('aside', block.callout.rich_text.map(richTextToMarkdown).reduce(mergeMarkdownInline)),
            );
            content += '\n\n';
          }
          break;
        }
        case 'toggle': {
          if (block.toggle.rich_text.length > 0) {
            content += indent(
              block.level,
              `- ${block.toggle.rich_text.map(richTextToMarkdown).reduce(mergeMarkdownInline)}`,
            );
            content += '\n';
          }
          break;
        }
        case 'code': {
          let code = '```';
          code += block.code.language;
          code += '\n';
          code += block.code.rich_text[0].plain_text;
          code += '\n';
          code += '```';
          if (block.code.caption.length > 0) {
            code += '\n\n';
            code += htmlWrap('figcaption', block.code.caption.map(richTextToMarkdown).reduce(mergeMarkdownInline));
          }
          content += indent(block.level, htmlWrap('figure', code));
          content += '\n\n';
          break;
        }
        case 'table': {
          // ensure table header
          tableHeader = true;
          break;
        }
        case 'table_row': {
          content += indent(
            block.level - 1, // unwrap table
            `| ${block.table_row.cells.map(cell => cell.map(richTextToMarkdown)).join(' | ')} |`,
          ).replaceAll('\n', '<br>');
          content += '\n';
          if (tableHeader) {
            // emit header
            content += indent(
              block.level - 1, // unwrap table
              `| ${block.table_row.cells.map(_ => '---').join(' | ')} |`,
            );
            content += '\n';
            tableHeader = false;
          }
          break;
        }
        case 'image': {
          const url = block.image.type === 'file' ? block.image.file.url : block.image.external.url;
          if (url) {
            let img = `![](${url})`; // there is no alt, only caption
            if (block.image.caption.length > 0) {
              img += '\n\n';
              img += htmlWrap('figcaption', block.image.caption.map(richTextToMarkdown).reduce(mergeMarkdownInline));
            }
            content += indent(block.level, htmlWrap('figure', img));
            content += '\n\n';
          }
          break;
        }
        case 'file': {
          const url = block.file.type === 'file' ? block.file.file.url : block.file.external.url;
          if (url) {
            const caption = block.file.caption.map(richTextToMarkdown).reduce(mergeMarkdownInline) || 'file';
            content += indent(block.level, `[${caption}](${url})`);
            content += '\n\n';
          }
          break;
        }
        case 'pdf': {
          const url = block.pdf.type === 'file' ? block.pdf.file.url : block.pdf.external.url;
          if (url) {
            const caption = block.pdf.caption.map(richTextToMarkdown).reduce(mergeMarkdownInline) || 'pdf';
            content += indent(block.level, `[${caption}](${url})`);
            content += '\n\n';
          }
          break;
        }
        case 'divider': {
          content += '----';
          content += '\n\n';
          break;
        }
        case 'equation': {
          // is always block
          content += `$$\n${block.equation.expression}\n$$`;
          content += '\n\n';
          break;
        }
        case 'audio':
        case 'video':
        case 'bookmark':
        case 'breadcrumb':
        case 'child_database':
        case 'child_page':
        case 'column':
        case 'column_list':
        case 'embed':
        case 'link_preview':
        case 'link_to_page':
        case 'synced_block':
        case 'table_of_contents':
        case 'template':
        case 'unsupported':
          // TODO or N/A
          break;
      }

      prevType = block.type;
    }
  }

  return content.trim();
}

function richTextToMarkdown(richText: RichTextItemResponse): string {
  function formatText(text: string, annotations: RichTextItemResponse['annotations'], url: URL | string | null = null) {
    let formatted = text;
    if (url) {
      formatted = `[${formatted}](${url.toString()})`;
    }
    if (annotations.code) {
      formatted = `\`${formatted}\``;
    }
    if (annotations.bold) {
      formatted = `**${formatted}**`;
    } else if (annotations.italic) {
      formatted = `_${formatted}_`;
    }
    if (annotations.strikethrough) {
      formatted = `~~${formatted}~~`;
    }
    return formatted.trimEnd();
  }

  if (richText.type === 'equation') {
    // GitHub-style inline equation
    return `$${richText.equation.expression}$`;
  }

  if (richText.href?.startsWith('/')) {
    // resolve relative link
    return formatText(richText.plain_text, richText.annotations, new URL(richText.href, baseUrl));
  }

  return formatText(richText.plain_text, richText.annotations, richText.href);
}

function indent(level: number, content: string): string {
  return content
    .split('\n')
    .map(line => {
      const indent = ' '.repeat(4).repeat(level);
      return indent + line;
    })
    .join('\n');
}

function mdQuote(content: string): string {
  return content
    .split('\n')
    .map(line => `> ${line}`)
    .join('\n');
}

/**
 * Safely wrap markdown content by HTML tag
 *
 * Proper line breaks is required to parse HTML-mixed markdown correctly
 *
 * @param tag HTML tag name
 * @param inner inner text
 * @returns wrapped text
 */
function htmlWrap(tag: MaybeLiteral<keyof HTMLElementTagNameMap>, inner: string): string {
  return `<${tag}>\n\n${inner}\n\n</${tag}>`;
}

/**
 * A reducer to merge multiple inline markdown text
 *
 * Merge annotations as needed
 *
 * @param text
 * @param part
 */
function mergeMarkdownInline(text: string, part: string): string {
  if (text.endsWith('**') && part.startsWith('** ')) {
    return text.slice(0, -2) + part.substring(2);
  }
  if (text.endsWith('~~') && part.startsWith('~~ ')) {
    return text.slice(0, -2) + part.substring(2);
  }
  if (text.endsWith('_') && part.startsWith('_ ')) {
    return text.slice(0, -1) + part.substring(1);
  }
  if (text.endsWith('`') && part.startsWith('` ')) {
    return text.slice(0, -1) + part.substring(1);
  }
  return text + part;
}
