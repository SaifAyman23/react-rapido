import binSadanImg from '@/assets/img/projects/Bin Sadan.webp'
import careerlyImg from '@/assets/img/projects/Careerly.webp'
import goImg from '@/assets/img/projects/Go.webp'
import powerZoneImg from '@/assets/img/projects/Power Zone.webp'
import streamoreImg from '@/assets/img/projects/Streamore.webp'

export const projects = [
  {
    eyebrow: '2026 · Platform',
    title: 'GO Delivery',
    image: goImg,
    description:
      'Multi-store delivery platform. Customer workflows, order management, auth with RBAC, real-time notifications, and architecture ready for merchants.',
    tags: ['Django', 'React', 'Redis', 'RBAC'],
  },
  {
    eyebrow: '2026 · AI Platform',
    title: 'Careerly',
    image: careerlyImg,
    description:
      'AI-powered career platform. Aggregates jobs from 4 sources, analyzes CVs, tailors resumes with AI, and tracks your applications.',
    tags: ['Django', 'DRF', 'React', 'TypeScript', 'AI'],
  },
  {
    eyebrow: '2025 · Enterprise',
    title: 'Bin Saedan Smart ERP',
    image: binSadanImg,
    description:
      'Smart ERP for enterprise workflows. REST APIs, database architecture, role-based access, and workflow automation built closely with the client.',
    tags: ['Django', 'DRF', 'PostgreSQL', 'React'],
  },
  {
    eyebrow: '2025 · Real-time',
    title: 'Streamore',
    image: streamoreImg,
    description:
      'Live streaming platform built on LiveKit and RTMP. Broadcast to 5 platforms at once with layouts, overlays, and WebSocket private chat.',
    tags: ['LiveKit', 'RTMP', 'WebSockets', 'React', 'Django'],
  },
  {
    eyebrow: '2024 · Microservice',
    title: 'Power Zone Dashboard',
    image: powerZoneImg,
    description:
      'Fitness dashboard for workouts, nutrition, and progress tracking. Coach views, RBAC, optimized APIs, and WebSocket realtime.',
    tags: ['React', 'Django', 'WebSockets'],
  },
] as const
