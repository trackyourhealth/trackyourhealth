export function convertToJsonOutput(entity: object): object {
  return JSON.parse(JSON.stringify(entity));
}

export function wrapToDataObject(data: object): object {
  return convertToJsonOutput({ data: data });
}
