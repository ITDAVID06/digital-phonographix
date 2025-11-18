// resources/js/pages/dashboard.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, PlusCircle } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard, games, postTest, preTest } from '@/routes';
import React from 'react';
import AddStudentModal from '@/components/modal/AddStudentModal';
import SelectStudentModal from '@/components/modal/SelectStudentModal';

export interface Student {
  id: number;
  name: string;
  grades: Array<{
    id: number;
    name: string;
    multiplier: string;
  }>;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
];

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = React.useState(false);
  const [testType, setTestType] = React.useState<"pre-test" | "post-test" | null>(null);

  // students are passed as Inertia props from backend
  const { students } = usePage<{ students: Student[] }>().props;

  const handleOpenSelectModal = (type: "pre-test" | "post-test") => {
    setTestType(type);
    setIsSelectModalOpen(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />

      <main className="flex-1 from-background via-accent/10 to-tertiary/20 flex items-center justify-center p-6">
        <div className="max-w-6xl w-full">

          {/* Header */}
          <header className="text-center mb-10 relative">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Literacy Toolkit</h1>
            <p className="text-foreground/70 mt-2">Choose a module to begin</p>

            {/* <div className="mt-6 flex justify-center">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold text-lg px-6 py-3 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <PlusCircle className="w-5 h-5" />
                Add Student
              </Button>
            </div> */}
          </header>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pre-test */}
            <div onClick={() => handleOpenSelectModal("pre-test")} className="group cursor-pointer">
              <Card className="p-6 h-full transition-all border-2 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-pink-50">
                <div className="flex flex-col h-full">
                  <h2 className="text-2xl font-semibold mb-2 text-pink-700">Pre-test</h2>
                  <p className="text-foreground/70 flex-1">
                    Quick baseline to gauge current phonics & word recognition.
                  </p>
                  <Button className="mt-4 group-hover:translate-x-0.5 transition-transform w-fit bg-yellow-400 hover:bg-yellow-500 text-white">
                    Start Pre-test
                  </Button>
                </div>
              </Card>
            </div>

            {/* Games */}
            <Link href={games().url} className="group">
              <Card className="p-6 h-full transition-all border-2 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-green-50 to-yellow-50">
                <div className="flex flex-col h-full">
                  <h2 className="text-2xl font-semibold mb-2 text-green-700">Games</h2>
                  <p className="text-foreground/70 flex-1">
                    Word building, reading stories, auditory processing, and sound bingo.
                  </p>
                  <Button className="mt-4 group-hover:translate-x-0.5 transition-transform w-fit bg-green-400 hover:bg-green-500 text-white">
                    Play Now
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Post-test */}
            <div onClick={() => handleOpenSelectModal("post-test")} className="group cursor-pointer">
              <Card className="p-6 h-full transition-all border-2 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-pink-50">
                <div className="flex flex-col h-full">
                  <h2 className="text-2xl font-semibold mb-2 text-blue-700">Post-test</h2>
                  <p className="text-foreground/70 flex-1">
                    Measure improvement and compare against your baseline.
                  </p>
                  <Button className="mt-4 group-hover:translate-x-0.5 transition-transform w-fit bg-blue-400 hover:bg-blue-500 text-white">
                    Start Post-test
                  </Button>
                </div>
              </Card>
            </div>

            {/* Instructions */}
            <Link href="/instructions" className="group">
              <Card className="p-6 h-full transition-all border-2 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="flex flex-col h-full">
                  <h2 className="text-2xl font-semibold mb-2 text-purple-700">Instructions</h2>
                  <p className="text-foreground/70 flex-1">
                    Complete teacher guide for Digital Phono-Graphix.
                  </p>
                  <Button className="mt-4 group-hover:translate-x-0.5 transition-transform w-fit bg-purple-400 hover:bg-purple-500 text-white">
                    View Guide
                  </Button>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>

      {/* Add Student Modal */}
      {/* <AddStudentModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} /> */}

      {/* Select Student Modal */}
      <SelectStudentModal
        open={isSelectModalOpen}
        onClose={() => setIsSelectModalOpen(false)}
        students={students || []}
        testType={testType}
      />
    </AppLayout>
  );
}
