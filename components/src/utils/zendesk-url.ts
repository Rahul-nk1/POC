const helpLink = "https://gohelp.discovery.com";
const zendeskParam = "sonicid";

//Appends Sonic ID to the helpdesk url, used by zendesk.
export const getZendeskUrl = (url: string, userId: string): string => {
  const zendeskUrl = url.includes(helpLink)
    ? `${url}?${zendeskParam}=${userId}`
    : url;

  return zendeskUrl;
};
