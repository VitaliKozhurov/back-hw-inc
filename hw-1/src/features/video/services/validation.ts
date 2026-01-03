import { availableResolutionsSet } from '../constants/availableResolutions';
import { ValidationError } from '../types/types';

export const stringFieldValidation = ({
  field,
  fieldName,
  maxLength,
}: {
  field: unknown;
  fieldName: string;
  maxLength: number;
}): ValidationError | null => {
  if (typeof field !== 'string') {
    return {
      field: fieldName,
      message: `${fieldName} is required and should be a string`,
    };
  }

  if (field.length === 0 || field.length > maxLength) {
    return {
      field: fieldName,
      message: `Incorrect ${fieldName} length`,
    };
  }

  return null;
};

export const videoResolutionValidation = (
  availableResolutions: unknown,
): ValidationError | null => {
  if (!Array.isArray(availableResolutions)) {
    return {
      field: 'availableResolutions',
      message: 'AvailableResolutions must be array',
    };
  }
  if (availableResolutions.length === 0) {
    return {
      field: 'availableResolutions',
      message: 'AvailableResolutions must be not empty',
    };
  }

  for (let resolution of availableResolutions) {
    if (!availableResolutionsSet.has(resolution)) {
      return {
        field: 'availableResolutions',
        message:
          'AvailableResolutions must be one of P144, P240, P360, P480, P720, P1080, P1440, P2160',
      };
    }
  }

  return null;
};

export const caBeDownloadedValidation = (
  canBeDownloaded: unknown,
): ValidationError | null => {
  if (typeof canBeDownloaded !== 'boolean') {
    return {
      field: 'canBeDownloaded',
      message: 'canBeDownloaded must be boolean',
    };
  }
  return null;
};

export const minAgeRestrictionValidation = (
  minAgeRestriction: unknown,
): ValidationError | null => {
  if (minAgeRestriction === null) {
    return null;
  }

  if (typeof minAgeRestriction !== 'number') {
    return {
      field: 'minAgeRestriction',
      message: 'minAgeRestriction must be number',
    };
  }

  if (minAgeRestriction < 1 || minAgeRestriction > 18) {
    return {
      field: 'minAgeRestriction',
      message: 'MinAgeRestriction must be between 1 and 18',
    };
  }

  return null;
};

export const publicationDateValidation = (
  publicationDate: unknown,
): ValidationError | null => {
  if (typeof publicationDate !== 'string') {
    return {
      field: 'publicationDate',
      message: 'publicationDate must be string',
    };
  }

  if (isNaN(new Date(publicationDate).getTime())) {
    return {
      field: 'publicationDate',
      message: 'publicationDate must be date',
    };
  }

  if (new Date(publicationDate).toISOString() !== publicationDate) {
    return {
      field: 'publicationDate',
      message: 'incorrect publicationDate value',
    };
  }

  return null;
};
