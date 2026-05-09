import ExamClient from './ExamClient';

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function ExamSessionPage({ params }: Props) {
  const { sessionId } = await params;
  return <ExamClient sessionId={sessionId} />;
}
