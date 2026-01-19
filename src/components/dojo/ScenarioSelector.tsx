import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Play } from "lucide-react"
import { DOJO_CONSTANTS } from "@/lib/constants/dojo"
import { DojoScenario, DojoDifficulty } from "@/types/dojo"

interface ScenarioSelectorProps {
   currentScenario: DojoScenario
   currentDifficulty: DojoDifficulty
   onStartNew: (scenario: DojoScenario, difficulty: DojoDifficulty) => Promise<void>
   trigger?: React.ReactNode
}

export function ScenarioSelector({ currentScenario, currentDifficulty, onStartNew, trigger }: ScenarioSelectorProps) {
   const [selectedScenario, setSelectedScenario] = useState<DojoScenario>(currentScenario)
   const [selectedDifficulty, setSelectedDifficulty] = useState<DojoDifficulty>(currentDifficulty)
   const [isOpen, setIsOpen] = useState(false)
   const [isStarting, setIsStarting] = useState(false)

   const handleStartNew = async () => {
      setIsStarting(true)
      try {
         await onStartNew(selectedScenario, selectedDifficulty)
         setIsOpen(false)
      } catch (error) {
         console.error('Start new session error:', error)
      } finally {
         setIsStarting(false)
      }
   }

   const getScenarioDescription = (scenario: DojoScenario): string => {
      const descriptions = {
         internet_troll: "Face off against a classic internet troll using strawman arguments, ad hominem attacks, and whataboutism. The goal is to maintain composure while addressing logical fallacies.",
         political_debate: "Engage with an extreme partisan debater who uses conspiracy theories and inflammatory rhetoric. Practice separating facts from emotionally charged opinions.",
         workplace_conflict: "Navigate passive-aggressive coworker behavior including backhanded compliments, rumor-spreading, and undermining tactics. Build professional resilience."
      }
      return descriptions[scenario] || descriptions.internet_troll
   }

   const getDifficultyDescription = (difficulty: DojoDifficulty): string => {
      const descriptions = {
         easy: "Gentle provocation with basic trolling tactics. Good for beginners.",
         medium: "Standard trolling with logical fallacies and emotional manipulation.",
         hard: "Aggressive trolling with conspiracy theories and personal attacks.",
         extreme: "Maximum provocation with hate speech, threats, and radical extremism."
      }
      return descriptions[difficulty]
   }

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            {trigger || (
               <Button variant="outline" size="sm" className="bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20">
                  <Settings className="h-4 w-4 mr-2" />
                  Change Scenario
               </Button>
            )}
         </DialogTrigger>
         <DialogContent className="bg-black/90 border-white/10 backdrop-blur-xl text-white max-w-2xl">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Training Scenario Settings
               </DialogTitle>
               <DialogDescription>
                  Choose your training scenario and difficulty level
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
               {/* Scenario Selection */}
               <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Scenario</label>
                  <Select value={selectedScenario} onValueChange={(value: DojoScenario) => setSelectedScenario(value)}>
                     <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent className="bg-black/90 border-white/10">
                        {Object.values(DOJO_CONSTANTS.SCENARIOS).map((scenario) => (
                           <SelectItem key={scenario} value={scenario} className="text-white hover:bg-white/10">
                              {scenario.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <p className="text-sm text-zinc-400">{getScenarioDescription(selectedScenario)}</p>
               </div>

               {/* Difficulty Selection */}
               <div className="space-y-3">
                  <label className="text-sm font-medium text-white">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={(value: DojoDifficulty) => setSelectedDifficulty(value)}>
                     <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent className="bg-black/90 border-white/10">
                        {Object.values(DOJO_CONSTANTS.DIFFICULTIES).map((difficulty) => (
                           <SelectItem key={difficulty} value={difficulty} className="text-white hover:bg-white/10 capitalize">
                              {difficulty}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
                  <p className="text-sm text-zinc-400">{getDifficultyDescription(selectedDifficulty)}</p>
               </div>

               {/* Current vs New Settings */}
               {(selectedScenario !== currentScenario || selectedDifficulty !== currentDifficulty) && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                     <h4 className="font-medium text-yellow-400 mb-2">Settings Changed</h4>
                     <p className="text-sm text-zinc-300">
                        Current: <span className="capitalize">{currentScenario.replace('_', ' ')}</span> ({currentDifficulty})
                        <br />
                        New: <span className="capitalize">{selectedScenario.replace('_', ' ')}</span> ({selectedDifficulty})
                     </p>
                  </div>
               )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
               <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isStarting}
                  className="border-white/10 text-zinc-300 hover:bg-white/5"
               >
                  Cancel
               </Button>
               <Button
                  onClick={handleStartNew}
                  disabled={isStarting}
                  className="bg-cyan-500/20 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30"
               >
                  {isStarting ? (
                     <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400 mr-2"></div>
                        Starting...
                     </>
                  ) : (
                     <>
                        <Play className="h-4 w-4 mr-2" />
                        Start New Session
                     </>
                  )}
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   )
}