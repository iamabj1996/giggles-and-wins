import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Laugh, RotateCcw, Crown, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import StarfieldBackground from "./StarfieldBackground";

const JokeCompetition = () => {
  const [myScore, setMyScore] = useState(0);
  const [girlfriendScore, setGirlfriendScore] = useState(0);
  const [lastScorer, setLastScorer] = useState<'me' | 'girlfriend' | null>(null);

  const incrementMyScore = () => {
    setMyScore(prev => prev + 1);
    setLastScorer('me');
    toast({
      description: "Great joke! 😄",
    });
  };

  const incrementGirlfriendScore = () => {
    setGirlfriendScore(prev => prev + 1);
    setLastScorer('girlfriend');
    toast({
      description: "She's got you laughing! 💕",
    });
  };

  const resetScores = () => {
    setMyScore(0);
    setGirlfriendScore(0);
    setLastScorer(null);
    toast({
      description: "Fresh start! May the best comedian win! 🎭",
    });
  };

  const getWinner = () => {
    if (myScore > girlfriendScore) return 'me';
    if (girlfriendScore > myScore) return 'girlfriend';
    return 'tie';
  };

  const winner = getWinner();

  return (
    <>
      <StarfieldBackground />
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Laugh className="text-primary animate-float" size={32} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Joke Competition
            </h1>
            <Heart className="text-primary animate-float" size={32} />
          </div>
          <p className="text-muted-foreground text-lg">
            Who tells the better jokes? Let the battle begin! 💝
          </p>
        </div>

        {/* Competition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* My Card */}
          <Card className={`romantic-card transition-all duration-300 hover:scale-105 ${
            lastScorer === 'me' ? 'ring-2 ring-primary ring-opacity-50' : ''
          }`}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Sparkles className="text-primary" size={24} />
                You
                {winner === 'me' && <Crown className="text-yellow-500" size={24} />}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className={`text-6xl font-bold text-primary ${
                lastScorer === 'me' ? 'score-bounce' : ''
              }`}>
                {myScore}
              </div>
              <Button
                onClick={incrementMyScore}
                variant="default"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105"
              >
                <Heart className="mr-2" size={20} />
                Nailed It!
              </Button>
            </CardContent>
          </Card>

          {/* Girlfriend's Card */}
          <Card className={`romantic-card transition-all duration-300 hover:scale-105 ${
            lastScorer === 'girlfriend' ? 'ring-2 ring-primary ring-opacity-50' : ''
          }`}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Heart className="text-pink-500" size={24} />
                Your Girlfriend
                {winner === 'girlfriend' && <Crown className="text-yellow-500" size={24} />}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className={`text-6xl font-bold text-primary ${
                lastScorer === 'girlfriend' ? 'score-bounce' : ''
              }`}>
                {girlfriendScore}
              </div>
              <Button
                onClick={incrementGirlfriendScore}
                variant="outline"
                size="lg"
                className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
              >
                <Heart className="mr-2" size={20} />
                She's Hilarious!
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Winner Display */}
        {(myScore > 0 || girlfriendScore > 0) && (
          <div className="text-center mb-6">
            <div className="romantic-card p-6 max-w-md mx-auto">
              {winner === 'tie' ? (
                <p className="text-lg font-semibold text-muted-foreground">
                  It's a tie! You're both comedy gold! ✨
                </p>
              ) : (
                <p className="text-lg font-semibold text-primary">
                  {winner === 'me' ? "You're" : "She's"} leading with the laughs! 🎭
                </p>
              )}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-center">
          <Button
            onClick={resetScores}
            variant="ghost"
            size="lg"
            className="hover:bg-accent transition-all duration-300"
          >
            <RotateCcw className="mr-2" size={20} />
            New Round
          </Button>
        </div>

        {/* Cute Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Made with 💕 for endless laughter together
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default JokeCompetition;