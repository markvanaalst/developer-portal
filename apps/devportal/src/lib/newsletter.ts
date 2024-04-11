import { NEWSLETTER_DATA_DIRECTORY } from '@lib/staticPaths';
import { translateDateAsYearMonth } from '@scdp/ui/lib';

import fs from 'fs';
import path from 'path';

const MAX_RESULTS = 12;

export const getNewsletterTitle = (dateAsYearMonth: string, title?: string) => (title ? `${title} - ${dateAsYearMonth}` : dateAsYearMonth);

export const getFirstXNewsletters = () => {
  const years = fs.readdirSync(NEWSLETTER_DATA_DIRECTORY);

  const newsletters = [];

  years.sort().reverse();

  // Using for loops to shortcut early
  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    const yearPath = path.resolve(NEWSLETTER_DATA_DIRECTORY, `${year}`);
    const months = fs.readdirSync(yearPath); //.sort().reverse();
    months.sort().reverse();
    for (let j = 0; j < months.length; j++) {
      const month = months[j];
      const { title, description } = JSON.parse(fs.readFileSync(path.resolve(yearPath, `${month}`), { encoding: 'utf-8' }));

      const monthWithoutFile = month.substring(0, 2);
      newsletters.push({
        title: getNewsletterTitle(translateDateAsYearMonth(`${year}-${monthWithoutFile}-03`), title),
        description,
        href: `newsletter/${year}/${monthWithoutFile}`,
      });

      if (newsletters.length === MAX_RESULTS) {
        return newsletters;
      }
    }
  }

  return newsletters;
};

export const getNewslettersByYear = async (year: string) => {
  const newsletters = [];
  // Using for loops to shortcut early
  const yearPath = path.resolve(NEWSLETTER_DATA_DIRECTORY, `${year}`);
  const months = fs.readdirSync(yearPath);
  months.sort().reverse();

  for (let j = 0; j < months.length; j++) {
    const month = months[j];
    const { title, description } = JSON.parse(fs.readFileSync(path.resolve(yearPath, `${month}`), { encoding: 'utf-8' }));

    const monthWithoutFile = month.substring(0, 2);
    newsletters.push({
      title: getNewsletterTitle(translateDateAsYearMonth(`${year}-${monthWithoutFile}-03`), title),
      description,
      href: `/newsletter/${year}/${monthWithoutFile}`,
    });

    if (newsletters.length === MAX_RESULTS) {
      return newsletters;
    }
  }

  return newsletters;
};

export const getNewsletter = async (month: string, year: string) => {
  return JSON.parse(
    fs.readFileSync(path.resolve(NEWSLETTER_DATA_DIRECTORY, `${year}`, `${month}.json`), {
      encoding: 'utf-8',
    })
  );
};

export const getLatestNewsletter = async () => {
  const newsletterDataDir = path.resolve(NEWSLETTER_DATA_DIRECTORY);
  const year = fs
    .readdirSync(newsletterDataDir)
    .map((y) => parseInt(y, 10))
    .sort((a, b) => b - a)[0];
  const month = fs
    .readdirSync(path.resolve(newsletterDataDir, `${year}`))
    .map((m: any) => {
      const name = m.substring(m, m.length - 5);
      return {
        name,
        num: parseInt(name, 10),
      };
    })
    .sort((a, b) => b.num - a.num)[0].name;

  const redirectUrl = `/newsletter/${year}/${month}`;

  return redirectUrl;
};