import { CreateFeed } from '@lib/changelog/changelog-feeds';
import { AllChangelogEntries } from 'sc-changelog/changelog';

// Default export to prevent next.js errors
const FeedPage = () => null;

export async function getServerSideProps(context: any) {
  const preview = context.preview ? context.preview : null;

  // Fetch data
  const changelogEntryList = await AllChangelogEntries(preview);
  const feed = await CreateFeed(changelogEntryList);
  //Set page headers
  context.res.setHeader('Content-Type', 'text/xml');
  // cache for 600s
  context.res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
  context.res.write(feed.atom1());
  context.res.end();

  return { props: {} };
}
export default FeedPage;
