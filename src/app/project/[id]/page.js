'use client';

import { useParams } from 'next/navigation';
import { ProjectDetails } from '../../../components';
import { Navbar, Footer, CustomCursor } from '../../../components';

export default function ProjectPage() {
  const params = useParams();
  
  return (
    <div className="relative z-0 bg-primary font-sans text-white overflow-hidden selection:bg-neon-purple selection:text-white">
      <CustomCursor />
      <Navbar />
      <ProjectDetails id={params.id} />
      <Footer />
    </div>
  );
}
