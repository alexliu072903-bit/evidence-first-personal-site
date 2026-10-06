export function sitePath(pathname = '') {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}${pathname.replace(/^\//, '')}`;
}

export function resourcePath(value: string) {
  if (/^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('//')) return value;
  return sitePath(value);
}
