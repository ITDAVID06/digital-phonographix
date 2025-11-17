import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BookOpen, Gamepad2, Award, Star } from "lucide-react";

const WelcomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-sky-200 via-pink-100 to-purple-200 overflow-hidden relative">
      {/* Floating Clouds */}
      <motion.div
        className="absolute top-10 left-0 w-48 h-24 bg-white opacity-70 rounded-full blur-3xl"
        animate={{ x: [0, 50, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
      <motion.div
        className="absolute top-20 right-0 w-64 h-32 bg-white opacity-60 rounded-full blur-3xl"
        animate={{ x: [0, -50, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />
      <motion.div
        className="absolute bottom-10 left-20 w-40 h-20 bg-white opacity-50 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />

      {/* Header Section */}
      <header className="text-center mt-16 z-10">
        <motion.h1
          className="text-6xl font-extrabold text-purple-700 mb-4 drop-shadow-md"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          🌈 Digital Phono-Graphix
        </motion.h1>
        <motion.p
          className="text-xl text-purple-600 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Learn letters, sounds, and words with magical gamified lessons!
        </motion.p>
      </header>

      {/* Gamified Lessons */}
      <section className="w-full max-w-6xl mt-12 z-10">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6 flex justify-center items-center gap-2">
          <Sparkles className="text-yellow-400 animate-pulse" /> Gamified Lessons
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-yellow-50 rounded-3xl shadow-xl p-6 border-2 border-yellow-200"
          >
            <CardHeader className="flex items-center justify-center text-2xl text-yellow-600">
              <BookOpen className="mr-2" /> Interactive Lessons
            </CardHeader>
            <CardContent className="text-center text-gray-700 font-medium">
              Learn letters and sounds through playful storybook adventures and animations!
            </CardContent>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-green-50 rounded-3xl shadow-xl p-6 border-2 border-green-200"
          >
            <CardHeader className="flex items-center justify-center text-2xl text-green-600">
              <Gamepad2 className="mr-2" /> Pre-Test
            </CardHeader>
            <CardContent className="text-center text-gray-700 font-medium">
              Test your skills before the journey begins — find your starting level!
            </CardContent>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-blue-50 rounded-3xl shadow-xl p-6 border-2 border-blue-200"
          >
            <CardHeader className="flex items-center justify-center text-2xl text-blue-600">
              <Award className="mr-2" /> Post-Test
            </CardHeader>
            <CardContent className="text-center text-gray-700 font-medium">
              Celebrate your progress with fun quizzes and colorful results!
            </CardContent>
          </motion.div>
        </div>
      </section>

      {/* Why Kids Love It (1 Card Only) */}
      <section className="w-full max-w-3xl mt-16 z-10">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          🌟 Why Kids Love It
        </h2>
        <div className="flex justify-center px-6">
          <motion.div
            whileHover={{ rotate: 2 }}
            className="bg-pink-100 rounded-3xl shadow-lg p-6 text-center border-2 border-pink-200 max-w-md"
          >
            <h3 className="text-2xl font-semibold text-pink-700 mb-2">Storybook Style</h3>
            <p className="text-gray-700">
              Fun illustrations and gentle animations make each lesson feel like a storybook adventure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="flex gap-6 mt-16 z-10">
        <Button
          asChild
          className="bg-purple-500 text-white hover:bg-purple-600 rounded-2xl px-8 py-4 text-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <a href="/login">Login</a>
        </Button>
        <Button
          asChild
          className="bg-pink-400 text-white hover:bg-pink-500 rounded-2xl px-8 py-4 text-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          <a href="/register">Register</a>
        </Button>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-purple-700 text-sm mb-6 z-10">
        &copy; 2025 <span className="font-bold">Digital Phonographix</span>. All rights reserved.
      </footer>

      {/* Decorative Stars */}
      <Star className="absolute top-12 left-1/2 text-yellow-400 opacity-70 animate-pulse" />
      <Star className="absolute bottom-20 right-10 text-yellow-400 opacity-70 animate-bounce" />
      <Star className="absolute top-1/3 left-10 text-yellow-400 opacity-50 animate-pulse" />
    </div>
  );
};

export default WelcomePage;
