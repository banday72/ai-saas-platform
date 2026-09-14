import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center mx-auto mb-3">
            <span className="text-black font-bold text-sm">C</span>
          </div>
          <h1 className="text-lg font-semibold text-white">
            Create your account
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Start generating content with AI
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none",
                headerTitle: "text-white",
                headerSubtitle: "text-zinc-400",
                socialButtonsBlockButton:
                  "border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700",
                formFieldInput:
                  "bg-zinc-800 border-zinc-700 text-white",
                footerActionLink: "text-amber-500 hover:text-amber-400",
                formButtonPrimary:
                  "bg-amber-500 hover:bg-amber-400 text-black",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
