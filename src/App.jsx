import { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Laugh, RotateCcw, Crown, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Stars component for 3D background
const Stars = () => {
  const ref = useRef(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      // Create a sphere distribution of stars
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      
      positions.set([x, y, z], i * 3);
      
      // Romantic pink/purple color palette
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        colors.set([1, 0.7, 0.9], i * 3); // Pink
      } else if (colorChoice < 0.6) {
        colors.set([0.9, 0.6, 1], i * 3); // Purple
      } else {
        colors.set([1, 1, 1], i * 3); // White
      }
    }
    
    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
      
      // Add subtle pulsing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

// Floating hearts component for 3D background
const FloatingHearts = () => {
  const heartsRef = useRef(null);
  
  const heartPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 15; i++) {
      positions.push({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 15,
        speed: Math.random() * 0.02 + 0.01,
      });
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (heartsRef.current) {
      heartsRef.current.children.forEach((heart, index) => {
        const pos = heartPositions[index];
        heart.position.y = pos.y + Math.sin(state.clock.elapsedTime * pos.speed) * 2;
        heart.rotation.y = state.clock.elapsedTime * pos.speed;
        heart.rotation.z = Math.sin(state.clock.elapsedTime * pos.speed * 0.5) * 0.3;
      });
    }
  });

  return (
    <group ref={heartsRef}>
      {heartPositions.map((pos, index) => (
        <mesh key={index} position={[pos.x, pos.y, pos.z]} scale={0.3}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#ff69b4" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
};

// Starfield background component
const StarfieldBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ 
          position: [0, 0, 1], 
          fov: 75,
          near: 0.1,
          far: 1000 
        }}
        style={{ 
          background: 'linear-gradient(180deg, hsl(340 15% 8%), hsl(310 25% 12%))'
        }}
      >
        <fog attach="fog" args={['#1a0d1a', 5, 25]} />
        <Stars />
        <FloatingHearts />
      </Canvas>
    </div>
  );
};

// Main joke competition component
const JokeCompetition = () => {
  const [myScore, setMyScore] = useState(0);
  const [girlfriendScore, setGirlfriendScore] = useState(0);
  const [lastScorer, setLastScorer] = useState(null);

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

// Main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <JokeCompetition />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;