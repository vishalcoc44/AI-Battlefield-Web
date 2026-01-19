import { Button } from "@/components/ui/button"
import { Wind, Play } from "lucide-react"

interface DojoEmptyStateProps {
   scenario: string
   onStartNew?: () => void
}

export function DojoEmptyState({ scenario, onStartNew }: DojoEmptyStateProps) {
   const scenarioDisplay = scenario.replace('_', ' ')
   const scenarioDescription = getScenarioDescription(scenario)

   return (
      <div className="flex-1 flex items-center justify-center p-8">
         <div className="text-center space-y-6 max-w-2xl">
            {/* Icon */}
            <div className="mx-auto w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20">
               <Wind className="h-12 w-12 text-cyan-400" />
            </div>

            {/* Title */}
            <div className="space-y-2">
               <h2 className="text-2xl font-black text-white tracking-tight">
                  Welcome to the Zen Dojo
               </h2>
               <p className="text-zinc-400 text-lg">
                  Test your emotional resilience in our AI-powered training simulation
               </p>
            </div>

            {/* Scenario Info */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
               <h3 className="text-lg font-bold text-white mb-2 capitalize">
                  Current Scenario: {scenarioDisplay}
               </h3>
               <p className="text-zinc-400 text-sm leading-relaxed">
                  {scenarioDescription}
               </p>
            </div>

            {/* Instructions */}
            <div className="space-y-4 text-left bg-black/20 border border-white/5 rounded-xl p-6">
               <h4 className="text-white font-bold">How to Play:</h4>
               <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-3">
                     <span className="text-cyan-400 font-bold mt-1">1.</span>
                     <span>The AI will present challenging, provocative statements designed to trigger emotional responses.</span>
                  </li>
                  <li className="flex items-start gap-3">
                     <span className="text-cyan-400 font-bold mt-1">2.</span>
                     <span>Respond calmly and rationally. Your responses are analyzed for emotional content.</span>
                  </li>
                  <li className="flex items-start gap-3">
                     <span className="text-cyan-400 font-bold mt-1">3.</span>
                     <span>Maintain your "Calm Score" above 50% to pass the simulation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                     <span className="text-cyan-400 font-bold mt-1">4.</span>
                     <span>Each calm response (+5 points) builds your resilience. Emotional responses (-10 points) show areas for growth.</span>
                  </li>
               </ul>
            </div>

            {/* Start Button */}
            <div className="pt-4">
               <Button
                  onClick={onStartNew}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black font-bold px-8 py-3 text-lg"
               >
                  <Play className="h-5 w-5 mr-2" />
                  Begin Training
               </Button>
            </div>

            {/* Tips */}
            <div className="text-xs text-zinc-500 space-y-1">
               <p>💡 <strong>Pro Tip:</strong> Focus on facts, avoid personal attacks, use "I" statements</p>
               <p>🎯 <strong>Goal:</strong> Stay calm and collected no matter the provocation</p>
            </div>
         </div>
      </div>
   )
}

function getScenarioDescription(scenario: string): string {
   const descriptions = {
      internet_troll: "Face off against a classic internet troll using strawman arguments, ad hominem attacks, and whataboutism. The goal is to maintain composure while addressing logical fallacies.",
      political_debate: "Engage with an extreme partisan debater who uses conspiracy theories and inflammatory rhetoric. Practice separating facts from emotionally charged opinions.",
      workplace_conflict: "Navigate passive-aggressive coworker behavior including backhanded compliments, rumor-spreading, and undermining tactics. Build professional resilience."
   }

   return descriptions[scenario as keyof typeof descriptions] || descriptions.internet_troll
}