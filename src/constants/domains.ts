import { Domain } from '@/types';

export const DOMAINS: Domain[] = [
  'Design Secure Architectures',
  'Design Resilient Architectures',
  'Design High-Performing Architectures',
  'Design Cost-Optimized Architectures',
];

export const DOMAIN_WEIGHTS: Record<Domain, number> = {
  'Design Secure Architectures': 30,
  'Design Resilient Architectures': 26,
  'Design High-Performing Architectures': 24,
  'Design Cost-Optimized Architectures': 20,
};

export const EXAM_QUESTION_COUNT = 65;
export const EXAM_DURATION_MINUTES = 130;
