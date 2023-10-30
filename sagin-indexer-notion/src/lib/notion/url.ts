export const baseUrl = new URL('https://www.notion.so');

type NotionObjectMeta = {
  uuid: string;
  workspace?: string;
  title?: string;
};

export function parseNotionObjectURL(url: URL): NotionObjectMeta {
  const { pathname } = url;
  const pattern = /((?<workspace>\w+)\/)?(?<title>[\w-]+)?(?<uuid>[0-9a-f]{32})$/;
  const match = pathname.match(pattern);
  if (!match) {
    throw new Error(`${url.href} is not a valid Notion URL`);
  }
  const groups = match.groups as {
    uuid: string;
    workspace?: string;
    title?: string;
  };
  return {
    uuid: uuidify(groups.uuid),
    workspace: groups.workspace,
    title: groups.title,
  };
}

export function makeNotionObjectURL(obj: NotionObjectMeta): URL {
  return new URL(`/${obj.uuid.replaceAll('-', '')}`, baseUrl);
}

export function uuidify(idString: string): string {
  const pattern = /([0-9a-z]{8})-?([0-9a-z]{4})-?([0-9a-z]{4})-?([0-9a-z]{4})-?([0-9a-z]{12})/;
  const match = idString.match(pattern);
  if (!match) {
    throw new Error(`${idString} is not a valid UUID`);
  }
  return `${match[1]}-${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
}
