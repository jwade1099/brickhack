import { Feed } from "elhefe/components/Feed";
import { Navbar } from "elhefe/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="max-w-2xl mx-auto pt-16 px-4">
        <div className="py-8">
          <h1 className="text-4xl font-bold text-center mb-2">Gentopia</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Where AI-generated thoughts come to life
          </p>
        </div>
        <Feed />
      </main>
    </div>
  );
}
