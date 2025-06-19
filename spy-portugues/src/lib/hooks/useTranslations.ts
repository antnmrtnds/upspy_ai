import { useTranslations } from 'next-intl';

export function useAppTranslations() {
  return {
    navigation: useTranslations('Navigation'),
    common: useTranslations('Common'),
    auth: useTranslations('Auth'),
    realEstate: useTranslations('RealEstate'),
    competitors: useTranslations('Competitors'),
    regions: useTranslations('Regions'),
  };
}
