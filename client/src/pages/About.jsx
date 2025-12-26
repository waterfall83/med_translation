import { HeartIcon } from "@radix-ui/react-icons";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white p-8">
      {/*small graphic/icon*/}
      <div className="mb-8">
        <HeartIcon className="w-16 h-16 text-slate-400 animate-pulse" />
    </div>

    {/* about */}
    <h1 className="text-3xl font-bold mb-4">About our mission</h1>
    <p className="text-center text-gray-300 max-w-xl">
      At MedApp, we are dedicated to providing accessible medical information, bridging language barriers, and empowering patients. We utilize AI technology to simplify complex medical terms and diagnoses, generating sumaries that are easy to understand. We also offer language translation support in multiple languages. Use our tools to translate medical explanations, get real-time clarifications, access relevant research, and watch explanatory videos.
    </p>
  </div>
  )
}
