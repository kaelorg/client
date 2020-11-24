import { isObject } from '@packages/utils';

function parseMessage(defaultMessage: any): any {
  let message = defaultMessage;

  if (isObject(message)) {
    message = JSON.stringify(message, [], 2);
  }

  return message;
}

export default parseMessage;
