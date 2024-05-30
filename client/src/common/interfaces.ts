import { Session } from 'next-auth';

export interface PageProps {
    session: Session | null;
  }