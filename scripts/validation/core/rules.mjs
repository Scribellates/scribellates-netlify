import fs from 'node:fs';
import path from 'node:path';

export const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
export const HTTP_URL_PATTERN = /^https?:\/\/.+/i;

export function isoDateRule(value) {
  if (!ISO_DATE_PATTERN.test(value)) {
    return 'doit respecter le format YYYY-MM-DD';
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return 'date invalide';
  }

  const [year, month, day] = value.split('-').map(Number);
  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() + 1 !== month
    || date.getUTCDate() !== day
  ) {
    return 'date invalide';
  }

  return null;
}

export function httpUrlRule(value) {
  if (!HTTP_URL_PATTERN.test(value)) {
    return 'doit être une URL http(s) valide';
  }

  try {
    new URL(value);
    return null;
  } catch {
    return 'doit être une URL http(s) valide';
  }
}

export function pathPrefixRule(prefix) {
  return (value) => (
    value.startsWith(prefix)
      ? null
      : `doit commencer par "${prefix}"`
  );
}

export function fileExistsFromWebPathRule({ projectRoot, sourceRoot = 'src' } = {}) {
  const sourceBaseDirectory = path.resolve(projectRoot, sourceRoot);

  return (value) => {
    if (typeof value !== 'string' || value.length === 0) {
      return 'chemin de fichier invalide';
    }

    if (!value.startsWith('/')) {
      return 'doit etre un chemin web absolu commencant par /';
    }

    const relativePath = value.replace(/^\/+/, '');
    const candidatePath = path.resolve(sourceBaseDirectory, relativePath.split('/').join(path.sep));
    const relativeCandidatePath = path.relative(sourceBaseDirectory, candidatePath);

    if (relativeCandidatePath.startsWith('..') || path.isAbsolute(relativeCandidatePath)) {
      return 'pointe en dehors du repertoire source autorise';
    }

    if (!fs.existsSync(candidatePath)) {
      return `fichier introuvable: ${value}`;
    }

    const stats = fs.statSync(candidatePath);
    if (!stats.isFile()) {
      return `le chemin ne pointe pas vers un fichier: ${value}`;
    }

    return null;
  };
}