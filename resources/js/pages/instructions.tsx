// resources/js/pages/instructions.tsx
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, UserPlus, ClipboardCheck, Gamepad2, BarChart3 } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: dashboard().url },
  { title: 'Instructions', href: '/instructions' },
];

export default function Instructions() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Teacher Guide - Digital Phono-Graphix" />

      <main className="flex-1 bg-gradient-to-br from-background via-purple-50/30 to-indigo-50/30 p-6">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <Link href={dashboard().url}>
              <Button variant="ghost" className="mb-4 -ml-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-10 h-10" />
                <h1 className="text-4xl font-bold">Teacher Guide</h1>
              </div>
              <p className="text-purple-100 text-lg">Digital Phono-Graphix Instruction Manual</p>
            </div>
          </div>

          {/* Quick Navigation */}
          <Card className="p-6 mb-8 bg-white/80">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-purple-600">📑</span> Quick Navigation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <a href="#add-student" className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Add a Student
              </a>
              <a href="#pre-test" className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                Pre-Test
              </a>
              <a href="#games" className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                Games
              </a>
              <a href="#post-test" className="text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Post-Test
              </a>
            </div>
          </Card>

          {/* Main Content */}
          <div className="space-y-8">
            
            {/* Add Student Section */}
            <Card id="add-student" className="p-8 bg-white/80 scroll-mt-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-purple-200">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <UserPlus className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-purple-900">Add a Student</h2>
              </div>
              
              <div className="space-y-4 text-foreground/80">
                <div className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</span>
                  <p>Click <span className="font-semibold text-purple-700">"Add Student"</span> button.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</span>
                  <p>Enter the student's name and select a grade level.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">3</span>
                  <p>Click <span className="font-semibold text-purple-700">"Save Student"</span>.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">4</span>
                  <p>Proceed to Pre-Test.</p>
                </div>
              </div>
            </Card>

            {/* Pre-Test Section */}
            <Card id="pre-test" className="p-8 bg-white/80 scroll-mt-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-yellow-200">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <ClipboardCheck className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-3xl font-bold text-yellow-900">Pre-Test</h2>
              </div>

              <div className="space-y-6">
                {/* Getting Started */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-yellow-800">Getting Started</h3>
                  <div className="space-y-2 text-foreground/80">
                    <div className="flex items-start gap-3">
                      <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</span>
                      <p>Click <span className="font-semibold text-yellow-700">"Start Pre-Test"</span>.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</span>
                      <p>Choose the name of the student you would like to work with (you can filter by grade level).</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-yellow-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">3</span>
                      <p>Click <span className="font-semibold text-yellow-700">"Start Pre-Test"</span>.</p>
                    </div>
                  </div>
                </div>

                {/* Test Components */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-yellow-800 mt-6">Test Components</h3>
                  
                  {/* Blending Test */}
                  <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                    <h4 className="font-semibold text-lg text-yellow-900 mb-2">📝 Blending Test</h4>
                    <p className="text-foreground/80">Segment the sounds of each word and have the student blend the sounds to create a word. Record the student's response first. Click <span className="font-semibold text-yellow-700">"Submit All"</span> to view the total score.</p>
                  </div>

                  {/* Phoneme Segmentation Test */}
                  <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                    <h4 className="font-semibold text-lg text-yellow-900 mb-2">🔊 Phoneme Segmentation Test</h4>
                    <p className="text-foreground/80">Say the word and have the student segment each sound. Click the box icon to mark the correct sounds the student produced. Click <span className="font-semibold text-yellow-700">"Submit All"</span> to view the total score.</p>
                  </div>

                  {/* Auditory Processing Test */}
                  <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                    <h4 className="font-semibold text-lg text-yellow-900 mb-2">👂 Auditory Processing Test</h4>
                    <p className="text-foreground/80">Read the instructions for each item aloud to the student. Record the student's final answer in the textbox provided. Click <span className="font-semibold text-yellow-700">"Submit All"</span> to view the total score.</p>
                  </div>

                  {/* Code Knowledge Test */}
                  <div className="bg-yellow-50 rounded-lg p-5 border border-yellow-200">
                    <h4 className="font-semibold text-lg text-yellow-900 mb-2">🔤 Code Knowledge Test</h4>
                    <div className="space-y-2 text-foreground/80">
                      <p>Click <span className="font-semibold text-yellow-700">"Teacher: Record Knowledge"</span> – This section is for the teacher only; do not show it to the student.</p>
                      <p>Return to the Code Knowledge Test tab, present each letter to the student, and have them say the sound of each letter. Check the corresponding letter box under <span className="font-semibold text-yellow-700">"Teacher: Record Knowledge"</span> if correct.</p>
                      <p>Click <span className="font-semibold text-yellow-700">"Submit All"</span> to view the total score.</p>
                    </div>
                  </div>
                </div>

                {/* Final Step */}
                <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-5 border-l-4 border-yellow-600 mt-6">
                  <p className="font-semibold text-yellow-900">✅ Compute the Composite Reading Score.</p>
                  <p className="text-sm text-foreground/70 mt-1">Then proceed to Games.</p>
                </div>
              </div>
            </Card>

            {/* Games Section */}
            <Card id="games" className="p-8 bg-white/80 scroll-mt-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-green-200">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-green-900">Games</h2>
              </div>

              <div className="space-y-8">
                
                {/* Word Building Activities */}
                <div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <span>🏗️</span> Word Building
                  </h3>
                  <p className="text-foreground/70 mb-4">Work through three themed activities with your student:</p>
                  
                  <div className="space-y-4">
                    {/* Fat Cat Activity */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🐱 The Fat Cat Sat</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Say the word and have the student segment each sound.</li>
                        <li>Drag each sound the student produces to the corresponding box to check for accuracy.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Fat Cat Story.</li>
                      </ol>
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-sm font-medium text-green-800">📖 Reading Stories: Fat Cat Story</p>
                        <p className="text-sm text-foreground/70">Have the student read each sentence.</p>
                      </div>
                    </div>

                    {/* Bug Activity */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🐞 The Bug on Jug</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Say the word and have the student segment each sound.</li>
                        <li>Drag each sound the student produces to the corresponding box to check for accuracy.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Bug on Jug Story.</li>
                      </ol>
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-sm font-medium text-green-800">📖 Reading Stories: Bug on Jug Story</p>
                        <p className="text-sm text-foreground/70">Have the student read each sentence.</p>
                      </div>
                    </div>

                    {/* Ben Bun Activity */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🍔 The Ben Bun</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Say the word and have the student segment each sound.</li>
                        <li>Drag each sound the student produces to the corresponding box to check for accuracy.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Ben Bun Story.</li>
                      </ol>
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-sm font-medium text-green-800">📖 Reading Stories: Ben Bun Story</p>
                        <p className="text-sm text-foreground/70">Have the student read each sentence.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Auditory Processing Activities */}
                <div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <span>👂</span> Auditory Processing
                  </h3>
                  <p className="text-foreground/70 mb-4">Help students build words through sound segmentation:</p>
                  
                  <div className="space-y-4">
                    {/* Fat Cat Auditory */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🐱 Fat Cat Sat</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Click <span className="font-semibold text-green-700">"Open Answer Key"</span> – This is for the teacher only; do not show it to the student.</li>
                        <li>Say each word listed in the answer key and have the student segment the sounds.</li>
                        <li>While they segment, enter their responses in the boxes to check whether they can build the word.</li>
                        <li>You may correct or prompt them to obtain the correct answer.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Fat Cat Story.</li>
                      </ol>
                    </div>

                    {/* Bug on Jug Auditory */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🐞 Bug on Jug</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Click <span className="font-semibold text-green-700">"Open Answer Key"</span> – This is for the teacher only.</li>
                        <li>Say each word listed and have the student segment the sounds.</li>
                        <li>Enter their responses in the boxes to check whether they can build the word.</li>
                        <li>You may correct or prompt them as needed.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Bug on Jug Story.</li>
                      </ol>
                    </div>

                    {/* Ben Bun Auditory */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🍔 Ben Bun</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Click <span className="font-semibold text-green-700">"Open Answer Key"</span> – This is for the teacher only.</li>
                        <li>Say each word listed and have the student segment the sounds.</li>
                        <li>Enter their responses in the boxes to check whether they can build the word.</li>
                        <li>You may correct or prompt them as needed.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Ben Bun Story.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Sound Bingo Activities */}
                <div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <span>🎲</span> Sound Bingo
                  </h3>
                  <p className="text-foreground/70 mb-4">Interactive sound-letter matching game:</p>
                  
                  <div className="space-y-4">
                    {/* Fat Cat Bingo */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🐱 Fat Cat</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Use the answer key from <span className="font-semibold">Auditory Processing: Fat Cat Sat</span> as your key card.</li>
                        <li>Say the segmented sound to the student and have them identify the letter that matches the sound.</li>
                        <li><span className="font-semibold text-green-700">Right-click</span> if correct. <span className="font-semibold text-red-600">Left-click</span> if incorrect.</li>
                        <li>The student may use the two cards to locate the letters.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Fat Cat Story.</li>
                      </ol>
                    </div>

                    {/* Bug on Jug Bingo */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🐞 Bug on Jug</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Use the answer key from <span className="font-semibold">Auditory Processing: Bug on Jug</span> as your key card.</li>
                        <li>Say the segmented sound to the student and have them identify the letter that matches the sound.</li>
                        <li><span className="font-semibold text-green-700">Right-click</span> if correct. <span className="font-semibold text-red-600">Left-click</span> if incorrect.</li>
                        <li>The student may use the two cards to locate the letters.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Bug on Jug Story.</li>
                      </ol>
                    </div>

                    {/* Ben Bun Bingo */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🍔 Ben Bun</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Use the answer key from <span className="font-semibold">Auditory Processing: Ben Bun</span> as your key card.</li>
                        <li>Say the segmented sound to the student and have them identify the letter that matches the sound.</li>
                        <li><span className="font-semibold text-green-700">Right-click</span> if correct. <span className="font-semibold text-red-600">Left-click</span> if incorrect.</li>
                        <li>The student may use the two cards to locate the letters.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Ben Bun.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Word List Activities */}
                <div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <span>📝</span> Word List
                  </h3>
                  <p className="text-foreground/70 mb-4">Practice reading words individually:</p>
                  
                  <div className="space-y-4">
                    {/* Fat Cat Word List */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🐱 Fat Cat Sat</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Present the word and have the student read it.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Fat Cat Story.</li>
                      </ol>
                    </div>

                    {/* Bug on Jug Word List */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🐞 Bug on Jug</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Present the word and have the student read it.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Bug on Jug Story.</li>
                      </ol>
                    </div>

                    {/* Ben Bun Word List */}
                    <div className="bg-green-50 rounded-lg p-5 border border-green-200">
                      <h4 className="font-semibold text-lg text-green-900 mb-3">🍔 Ben Bun</h4>
                      <ol className="space-y-2 text-foreground/80 list-decimal list-inside ml-2">
                        <li>Present the word and have the student read it.</li>
                        <li className="font-semibold text-green-700">Proceed to Reading Stories: Ben Bun Story.</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Final Activities */}
                <div>
                  <h3 className="text-2xl font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <span>🎯</span> Final Activities
                  </h3>
                  <p className="text-foreground/70 mb-4">Complete these reading activities before moving to the Post-Test:</p>
                  
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border-l-4 border-green-600">
                      <h4 className="font-semibold text-green-900">📖 Mad Cat</h4>
                      <p className="text-sm text-foreground/70">Present the text and have the student read it.</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border-l-4 border-green-600">
                      <h4 className="font-semibold text-green-900">📖 Missing Cat</h4>
                      <p className="text-sm text-foreground/70">Present the text and have the student read it.</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border-l-4 border-green-600">
                      <h4 className="font-semibold text-green-900">📖 Fun in the Sun</h4>
                      <p className="text-sm text-foreground/70">Present the text and have the student read it.</p>
                    </div>
                  </div>

                  <div className="mt-4 bg-green-600 text-white rounded-lg p-4">
                    <p className="font-semibold">✅ After completing all final activities, proceed to Post-Test.</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Post-Test Section */}
            <Card id="post-test" className="p-8 bg-white/80 scroll-mt-6">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-200">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-blue-900">Post-Test</h2>
              </div>

              <div className="space-y-6">
                {/* Getting Started */}
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-blue-800">Getting Started</h3>
                  <div className="space-y-2 text-foreground/80">
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">1</span>
                      <p>Click <span className="font-semibold text-blue-700">"Start Post-Test"</span>.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">2</span>
                      <p>Choose the name of the student you would like to work with (you can filter by grade level).</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">3</span>
                      <p>Click <span className="font-semibold text-blue-700">"Start Post-Test"</span>.</p>
                    </div>
                  </div>
                </div>

                {/* Test Components */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-blue-800 mt-6">Test Components</h3>
                  <p className="text-foreground/70 text-sm italic">The Post-Test follows the same format as the Pre-Test:</p>
                  
                  {/* Blending Test */}
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                    <h4 className="font-semibold text-lg text-blue-900 mb-2">📝 Blending Test</h4>
                    <p className="text-foreground/80">Segment the sounds of each word and have the student blend them to create a word. Record the student's response first. Click <span className="font-semibold text-blue-700">"Submit All"</span> to view the total score.</p>
                  </div>

                  {/* Phoneme Segmentation Test */}
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                    <h4 className="font-semibold text-lg text-blue-900 mb-2">🔊 Phoneme Segmentation Test</h4>
                    <p className="text-foreground/80">Say the word and have the student segment each sound. Click the box icon to mark the correct sounds the student produced. Click <span className="font-semibold text-blue-700">"Submit All"</span> to view the total score.</p>
                  </div>

                  {/* Auditory Processing Test */}
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                    <h4 className="font-semibold text-lg text-blue-900 mb-2">👂 Auditory Processing Test</h4>
                    <p className="text-foreground/80">Read the instructions for each item aloud to the student. Record the student's final answer in the textbox provided. Click <span className="font-semibold text-blue-700">"Submit All"</span> to view the total score.</p>
                  </div>

                  {/* Code Knowledge Test */}
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                    <h4 className="font-semibold text-lg text-blue-900 mb-2">🔤 Code Knowledge Test</h4>
                    <div className="space-y-2 text-foreground/80">
                      <p>Click <span className="font-semibold text-blue-700">"Teacher: Record Knowledge"</span> – This is for the teacher only; do not show it to the student.</p>
                      <p>Return to the Code Knowledge Test tab, present each letter to the student, and have them say the sound of each letter. Check the corresponding letter box if correct.</p>
                      <p>Click <span className="font-semibold text-blue-700">"Submit All"</span> to view the total score.</p>
                    </div>
                  </div>
                </div>

                {/* Final Step */}
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-5 border-l-4 border-blue-600 mt-6">
                  <p className="font-semibold text-blue-900">✅ Compute the Composite Reading Score.</p>
                  <p className="text-sm text-foreground/70 mt-1">Compare the results with the Pre-Test to measure student progress.</p>
                </div>
              </div>
            </Card>

          </div>

          {/* Bottom Navigation */}
          <div className="mt-12 text-center">
            <Link href={dashboard().url}>
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Dashboard
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <footer className="text-center mt-8 text-foreground/60 text-sm pb-8">
            <p>Digital Phono-Graphix Teacher Guide</p>
          </footer>
        </div>
      </main>
    </AppLayout>
  );
}
