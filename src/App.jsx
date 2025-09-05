import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import axios from "axios";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Laugh, RotateCcw, Minus } from "lucide-react";
import { FaIceCream, FaGamepad } from "react-icons/fa";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Query client setup
const queryClient = new QueryClient();

// Stars background
const Stars = () => {
  const ref = useRef(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);

    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;

      positions.set([x, y, z], i * 3);

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
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={positions}
        colors={colors}
        stride={3}
        frustumCulled={false}
      >
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

// Floating hearts background
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
        heart.position.y =
          pos.y + Math.sin(state.clock.elapsedTime * pos.speed) * 2;
        heart.rotation.y = state.clock.elapsedTime * pos.speed;
        heart.rotation.z =
          Math.sin(state.clock.elapsedTime * pos.speed * 0.5) * 0.3;
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

// Starfield wrapper
const StarfieldBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{
          position: [0, 0, 1],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        style={{
          background:
            "linear-gradient(180deg, hsl(340 15% 8%), hsl(310 25% 12%))",
        }}
      >
        <fog attach="fog" args={["#1a0d1a", 5, 25]} />
        <Stars />
        <FloatingHearts />
      </Canvas>
    </div>
  );
};

// JokeCompetition component
const JokeCompetition = () => {
  const [myScore, setMyScore] = useState(0);
  const [girlfriendScore, setGirlfriendScore] = useState(0);
  const [lastScorer, setLastScorer] = useState(null);
  const [allScores, setAllScores] = useState([]);

  console.log("allScores", allScores);

  const fetchScores = async () => {
    try {
      axios.defaults.baseURL = "https://joketracker.onrender.com";
      const response = await axios.get("/api/updateScore");
      console.log("allData", response.data);

      setAllScores(response.data); // ✅ Correctly set the fetched data
    } catch (err) {
      console.error("Failed to fetch scores", err);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  useEffect(() => {
    const nikhil = allScores.find((s) => s.name.toLowerCase() === "nikhil");
    const nishita = allScores.find((s) => s.name.toLowerCase() === "nishita");

    if (nikhil) setMyScore(nikhil.score);
    if (nishita) setGirlfriendScore(nishita.score);
  }, [allScores]);

  const updateScore = async (name, type) => {
    try {
      axios.defaults.baseURL = "https://joketracker.onrender.com";
      await axios.get(`/api/updateScore/update-score/${name}/${type}`);
      fetchScores(); // Refresh scores
    } catch (err) {
      console.error("Failed to update score:", err);
    }
  };

  const incrementMyScore = () => {
    setMyScore((prev) => prev + 1);
    setLastScorer("me");
    updateScore("Nikhil", "positive");
    toast({ description: "Great joke! 😄" });
  };

  const decrementMyScore = () => {
    if (myScore > 0) {
      setMyScore((prev) => prev - 1);
      setLastScorer("me");
      updateScore("Nikhil", "negative");
      toast({ description: "Aww, better luck next time! 🥺" });
    }
  };

  const incrementGirlfriendScore = () => {
    setGirlfriendScore((prev) => prev + 1);
    setLastScorer("girlfriend");
    updateScore("Nishita", "positive");
    toast({ description: "She's got you laughing! 💕" });
  };

  const decrementGirlfriendScore = () => {
    if (girlfriendScore > 0) {
      setGirlfriendScore((prev) => prev - 1);
      setLastScorer("girlfriend");
      updateScore("Nishita", "negative");
      toast({ description: "Even pros have off days 😅" });
    }
  };

  const resetScores = () => {
    setMyScore(0);
    setGirlfriendScore(0);
    setLastScorer(null);
    toast({ description: "Fresh start! May the best comedian win! 🎭" });
  };

  const getWinner = () => {
    if (myScore > girlfriendScore) return "me";
    if (girlfriendScore > myScore) return "girlfriend";
    return "tie";
  };

  const winner = getWinner();

  return (
    <>
      <StarfieldBackground />
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Laugh className="text-primary animate-float" size={32} />
              <h1 className="text-muted-foreground font-bold text-4xl">
                Who is funnier ??
              </h1>
              <Laugh className="text-primary animate-float" size={32} />
            </div>
            <p className="text-muted-foreground text-lg mb-4">
              Who tells the better jokes? Let the battle begin! 💪💪
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {allScores.map((player, index) => {
              const isNikhil = player.name.toLowerCase() === "nikhil";
              const isLastScorer =
                lastScorer === (isNikhil ? "me" : "girlfriend");

              const handleIncrement = () => {
                if (isNikhil) {
                  setMyScore((prev) => prev + 1);
                  setLastScorer("me");
                  updateScore("Nikhil", "positive");
                  toast({ description: "Nailed it! 🔥" });
                } else {
                  setGirlfriendScore((prev) => prev + 1);
                  setLastScorer("girlfriend");
                  updateScore("Nishita", "positive");
                  toast({ description: "She's hilarious! 💕" });
                }
              };

              const handleDecrement = () => {
                if (isNikhil && myScore > 0) {
                  setMyScore((prev) => prev - 1);
                  setLastScorer("me");
                  updateScore("Nikhil", "negative");
                  toast({ description: "Oops! Try again 😅" });
                } else if (!isNikhil && girlfriendScore > 0) {
                  setGirlfriendScore((prev) => prev - 1);
                  setLastScorer("girlfriend");
                  updateScore("Nishita", "negative");
                  toast({ description: "Even stars stumble 🌟" });
                }
              };

              const displayedScore = isNikhil ? myScore : girlfriendScore;

              return (
                <Card
                  key={player.name}
                  className={`romantic-card transition-all duration-300 hover:scale-105 ${
                    isLastScorer ? "ring-2 ring-primary ring-opacity-50" : ""
                  }`}
                >
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                      {isNikhil ? (
                        <>
                          <FaGamepad className="text-primary" size={24} />
                          Nikhil
                        </>
                      ) : (
                        <>
                          <FaIceCream className="text-primary" size={24} />
                          Nishita
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div
                      className={`text-6xl font-bold text-primary ${
                        isLastScorer ? "score-bounce" : ""
                      }`}
                    >
                      {displayedScore}
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={handleIncrement}>
                        <Heart className="mr-2" size={20} />
                        {isNikhil ? "Nailed it!" : "Hilarious!"}
                      </Button>
                      <Button variant="outline" onClick={handleDecrement}>
                        <Minus className="mr-2" size={20} />
                        {isNikhil ? "Oops!" : "Missed it!"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Winner */}
          {(myScore > 0 || girlfriendScore > 0) && (
            <div className="text-center mb-6">
              <div className="romantic-card p-6 max-w-md mx-auto">
                {winner === "tie" ? (
                  <p className="text-lg font-semibold text-muted-foreground">
                    It's a tie! You're both comedy gold! ✨
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-primary">
                    {winner === "me" ? "Abraham" : "Nishita"} leading with the
                    laughs! 🎭
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Reset */}
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
        </div>
      </div>
    </>
  );
};

// App wrapper
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
