import PracticeClient from './PracticeClient';

interface Props {
  params: Promise<{ domain: string }>;
}

export default async function PracticeDomainPage({ params }: Props) {
  const { domain } = await params;
  return <PracticeClient domain={decodeURIComponent(domain)} />;
}
