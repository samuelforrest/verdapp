import Image from "next/image";
import TeachableMachineClient from "@/components/TeachableMachineClient"; // Import the new component

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 sm:p-12 md:p-24 bg-lime-50 dark:bg-green-900 text-green-800 dark:text-lime-100">
      {/* Header Section */}
      <div className="z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between font-mono text-sm">
        <p className="w-full sm:w-auto flex justify-center sm:justify-start border-b border-green-300 bg-gradient-to-b from-lime-200 pb-4 pt-6 backdrop-blur-2xl dark:border-green-700 dark:bg-green-800/60 dark:from-inherit lg:rounded-xl lg:border lg:bg-lime-100 lg:p-4 lg:dark:bg-green-800/60 text-center sm:text-left mb-4 sm:mb-0">
          Trash Sorting App
        </p>
        <div className="flex h-auto items-end justify-center lg:static lg:size-auto lg:bg-none opacity-75 hover:opacity-100 transition-opacity">
          <a
            className="flex place-items-center gap-2 p-4 lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={80}
              height={20}
              priority
            />
          </a>
        </div>
      </div>

      {/* Camera Feed Section - Replaced with TeachableMachineClient */}
      <div className="w-full max-w-2xl flex flex-col items-center">
        <TeachableMachineClient />
      </div>

      {/* Information Cards Section - This will be at the bottom */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
        <div className="group rounded-xl border border-green-300 dark:border-green-700 bg-white dark:bg-green-800/50 p-6 shadow-md transition-all hover:shadow-lg hover:border-green-400 dark:hover:border-green-500">
          <h2 className="mb-3 text-2xl font-semibold text-green-700 dark:text-lime-200">
            Trash Type{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-75 text-green-600 dark:text-lime-300 mx-auto md:mx-0">
            [Model Output: Recycle/Compost/Trash]
          </p>
        </div>

        <div className="group rounded-xl border border-green-300 dark:border-green-700 bg-white dark:bg-green-800/50 p-6 shadow-md transition-all hover:shadow-lg hover:border-green-400 dark:hover:border-green-500">
          <h2 className="mb-3 text-2xl font-semibold text-green-700 dark:text-lime-200">
            Designated Bin{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-75 text-green-600 dark:text-lime-300 mx-auto md:mx-0">
            [Corresponding Bin Image/Color]
          </p>
        </div>
      </div>
    </main>
  );
}
