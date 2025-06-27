import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserService } from '../../services/user.service';
import { firestoreService } from '../../services';
import { useBadge } from '../../contexts/BadgeContext';
import StreakNotification from '../streak/StreakNotification';

const GOLD = '#f5e1a0';
const PRIMARY_BG = 'bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233]';
const CARD_BG = 'bg-black/40 backdrop-blur-md';
const CARD_BORDER = 'border border-[#f5e1a0]/20';
const CARD_RADIUS = 'rounded-2xl';
const CARD_SHADOW = 'shadow-lg';
const FONT_SERIF = 'font-serif';

const userService = new UserService();

const articles: Record<string, { title: string; text: string }> = {
  '21A': {
    title: 'Article 21A - Right to Education',
    text: 'Every child between the ages of 6-14 has the fundamental right to free and compulsory education. This means no school can deny admission based on economic status, and the state must provide quality education facilities.'
  },
  '14': {
    title: 'Article 14 - Right to Equality',
    text: 'The State shall not deny to any person equality before the law or equal protection of laws. This ensures that all citizens, regardless of their background, are treated equally by the legal system.'
  },
  '19': {
    title: 'Article 19 - Freedom of Speech',
    text: 'All citizens have the right to freedom of speech and expression, freedom to assemble peacefully, freedom to form associations, and freedom to practice any profession or business.'
  },
  '32': {
    title: 'Article 32 - Right to Constitutional Remedies',
    text: "Called the 'Heart of the Constitution' by Dr. Ambedkar, this article allows citizens to directly approach the Supreme Court when their fundamental rights are violated."
  }
};

type Choice = {
    text: string;
    points: number;
    next: number | string;
    article?: keyof typeof articles;
    badge?: string;
};

type Scene = {
    speaker: string;
    text: string;
    background: string;
    choices: Choice[];
    tip: string;
};

type Episode = {
    title: string;
    background: string;
    scenes: Scene[];
};

const ConstitutionChronicles: React.FC = () => {
  const { currentUser } = useAuth();
  const { showBadgeNotification } = useBadge();
  const [episodes, setEpisodes] = useState<Record<number, Episode> | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [currentScene, setCurrentScene] = useState(0);
  const [constitutionalPoints, setConstitutionalPoints] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [playerLevel, setPlayerLevel] = useState(1);
  const [showArticle, setShowArticle] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<{ title: string; text: string } | null>(null);
  const [showBadge, setShowBadge] = useState(false);
  const [currentBadge, setCurrentBadge] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [showStreakNotification, setShowStreakNotification] = useState(false);
  const [streakMessage, setStreakMessage] = useState('');
  const [streakBonus, setStreakBonus] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Level calculation function
  const calculateLevel = (points: number): number => {
    // Level formula: every 50 points = 1 level
    return Math.floor(points / 50) + 1;
  };

  // Level progress calculation (0-100%)
  const calculateLevelProgress = (points: number): number => {
    const currentLevel = calculateLevel(points);
    const pointsForCurrentLevel = (currentLevel - 1) * 50;
    const pointsForNextLevel = currentLevel * 50;
    const progress = ((points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Check for level up and rewards
  const checkLevelUp = (newPoints: number, oldPoints: number) => {
    const oldLevel = calculateLevel(oldPoints);
    const newLevel = calculateLevel(newPoints);
    
    if (newLevel > oldLevel) {
      setNewLevel(newLevel);
      setShowLevelUp(true);
      setShowOverlay(true);
      
      // Award level-based badges
      const levelBadges = {
        5: 'Constitutional Scholar',
        10: 'Rights Defender',
        15: 'Democracy Guardian',
        20: 'Constitutional Master',
        25: 'Supreme Protector'
      };
      
      if (levelBadges[newLevel as keyof typeof levelBadges]) {
        const badgeName = levelBadges[newLevel as keyof typeof levelBadges];
        if (!badges.includes(badgeName)) {
          setBadges(prev => [...prev, badgeName]);
          showBadgeNotification({ id: badgeName, name: badgeName, description: `Reached level ${newLevel}`, imageUrl: '', criteria: `Reach level ${newLevel}` });
        }
      }
      
      // Update user level in database
      if (currentUser) {
        userService.incrementLevel(currentUser.uid, newLevel - oldLevel);
      }
      
      setTimeout(() => {
        setShowLevelUp(false);
        setShowOverlay(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const fetchGameData = async () => {
      setLoading(true);
      try {
        const data = await firestoreService.getAll<Episode & { id: string }>('constitution-chronicles');
        
        const episodesData: Record<number, Episode> = {};
        if (data && data.length > 0) {
          data.forEach(episode => {
            episodesData[Number(episode.id)] = episode;
          });
        }
        
        // If Firestore data is incomplete or missing, merge with comprehensive fallback
        const finalEpisodes = { ...fallbackEpisodes, ...episodesData };
        setEpisodes(finalEpisodes);

      } catch (error) {
        console.error("Failed to fetch game data, using complete fallback:", error);
        setEpisodes(fallbackEpisodes);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, []);

  useEffect(() => {
    // Function to load game state from Firestore
    const loadGameState = async () => {
      if (currentUser) {
        const userProfile = await userService.getUserProfile(currentUser.uid);
        if (userProfile?.games?.constitutionChronicles) {
          const { currentEpisode, currentScene, constitutionalPoints, badges } = userProfile.games.constitutionChronicles;
          setCurrentEpisode(currentEpisode);
          setCurrentScene(currentScene);
          setConstitutionalPoints(constitutionalPoints);
          setBadges(badges);
          setPlayerLevel(calculateLevel(constitutionalPoints));
        }
      }
    };

    loadGameState();
  }, [currentUser]);

  // --- RESUMABLE GAME LOGIC ---
  // Progress is saved to Firestore after every significant user action (e.g., after makeChoice).
  // On load, progress is restored from Firestore if available.
  const saveGameState = async () => {
    if (currentUser) {
      await userService.updateUserProfile(currentUser.uid, {
        // TODO: Add the fields you want to save for game progress, e.g.:
        // constitutionChronicles: { episode, scene, points, badges, ... }
      });
    }
  };

  if (loading || !episodes) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233]">
        <div className="text-center text-[#f5e1a0]">
          <div className="text-2xl mb-4 font-playfair">Loading Constitution Chronicles...</div>
          <div className="text-sm opacity-75">Preparing your constitutional journey</div>
        </div>
      </div>
    );
  }

  const currentEpisodeData = episodes[currentEpisode as keyof typeof episodes];
  const currentSceneData = currentEpisodeData?.scenes[currentScene];

  // Check if episode is complete
  const isEpisodeComplete = currentEpisodeData && currentScene >= currentEpisodeData.scenes.length;

  const loadEpisode = (episode: number) => {
    setCurrentEpisode(episode);
    setCurrentScene(0);
    setGameComplete(false); // Reset completion state when loading new episode
  };

  const makeChoice = async (choiceIndex: number) => {
    if (!currentSceneData || !currentEpisodeData) return;
    
    const choice = currentSceneData.choices[choiceIndex];
    const oldPoints = constitutionalPoints;
    const newPoints = oldPoints + (choice.points || 0);
    
    setConstitutionalPoints(newPoints);
    
    // Check for level up
    checkLevelUp(newPoints, oldPoints);
    
    // Update player level display
    setPlayerLevel(calculateLevel(newPoints));
    
    let nextScene = choice.next;

    if (choice.article) {
      setCurrentArticle(articles[choice.article]);
      setShowArticle(true);
      setShowOverlay(true);
    }
    
    if (choice.badge) {
      setCurrentBadge(choice.badge);
      setShowBadge(true);
      setShowOverlay(true);
      if (!badges.includes(choice.badge)) {
        setBadges(prev => [...prev, choice.badge!]);
      }
      setTimeout(() => {
        setShowBadge(false);
        setShowOverlay(false);
      }, 3000);
    }

    if (typeof nextScene === 'string' && nextScene.startsWith('episode')) {
      const episodeNum = parseInt(nextScene.replace('episode', ''), 10);
      if (!isNaN(episodeNum)) {
        loadEpisode(episodeNum);
      }
    } else if (typeof nextScene === 'number') {
      if (nextScene < currentEpisodeData.scenes.length) {
        setCurrentScene(nextScene);
      } else {
        // Reached end of episode - trigger streak logic
        if (currentUser) {
          try {
            const streakResult = await userService.completeQuiz(currentUser.uid, newPoints, 'constitution-chronicles');
            if (streakResult.streakUpdated) {
              setStreakMessage(streakResult.message);
              setStreakBonus(streakResult.streakBonus);
              setCurrentStreak(streakResult.newStreak);
              setShowStreakNotification(true);
            }
          } catch (error) {
            console.error('Error updating streak:', error);
          }
        }
        setGameComplete(true);
      }
    }

    // After updating state, save progress
    await saveGameState();
  };

  const closeArticle = () => {
    setShowArticle(false);
    setShowOverlay(false);
    setCurrentArticle(null);
  };

  const progress = Math.min(100, Math.round((currentScene / (currentEpisodeData?.scenes.length - 1)) * 100));

  // Show episode complete screen
  if (gameComplete || isEpisodeComplete) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233]">
        <div className="text-center text-[#f5e1a0] max-w-md mx-auto p-8">
          <div className="text-4xl mb-6 font-playfair">🎉 Episode Complete!</div>
          <div className="text-lg mb-8 font-serif">
            Congratulations! You've completed "{currentEpisodeData?.title}". 
            Your constitutional knowledge is growing stronger!
          </div>
          <div className="text-sm mb-8 opacity-75">
            Constitutional Points: {constitutionalPoints}
          </div>
          <button
            onClick={() => loadEpisode(1)}
            className="bg-[#f5e1a0] text-[#1a2233] px-6 py-3 rounded-[25px] font-bold transition-transform hover:scale-105"
          >
            Return to Start
          </button>
        </div>
      </div>
    );
  }

  // Show coming soon for episodes without content
  if (!currentEpisodeData || currentEpisodeData.scenes.length === 0) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233]">
        <div className="text-center text-[#f5e1a0] max-w-md mx-auto p-8">
          <div className="text-3xl mb-6 font-playfair">🚧 Coming Soon!</div>
          <div className="text-lg mb-8 font-serif">
            Episode {currentEpisode} is currently under development. 
            More constitutional adventures are on their way!
          </div>
          <button
            onClick={() => loadEpisode(1)}
            className="bg-[#f5e1a0] text-[#1a2233] px-6 py-3 rounded-[25px] font-bold transition-transform hover:scale-105"
          >
            Return to Available Episodes
          </button>
        </div>
      </div>
    );
  }

  // Show error if no scene data
  if (!currentSceneData) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233]">
        <div className="text-center text-[#f5e1a0] max-w-md mx-auto p-8">
          <div className="text-3xl mb-6 font-playfair">⚠️ Content Loading Error</div>
          <div className="text-lg mb-8 font-serif">
            There was an issue loading the content for this scene. 
            Please try selecting the episode again.
          </div>
          <button
            onClick={() => loadEpisode(1)}
            className="bg-[#f5e1a0] text-[#1a2233] px-6 py-3 rounded-[25px] font-bold transition-transform hover:scale-105"
          >
            Return to Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#181e26] via-[#232b39] to-[#1a2233] p-2 md:p-4">
      <div className="w-full max-w-[1400px] h-[95vh] bg-black/40 backdrop-blur-md border border-[#f5e1a0]/20 rounded-xl md:rounded-2xl shadow-lg overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-[10px] p-3 md:p-4 border-b border-[#f5e1a0]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="text-[#f5e1a0] text-lg md:text-2xl font-bold font-playfair drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)]">
            🏛️ The Constitution Chronicles
          </div>
          <div className="flex gap-1 md:gap-2 flex-wrap order-3 md:order-2">
            {Object.keys(episodes).map(epKey => {
              const episodeNum = Number(epKey);
              const episode = episodes[episodeNum];
              return (
                <button
                  key={episodeNum}
                  className={`px-2 md:px-4 py-1 md:py-2 rounded-[15px] md:rounded-[20px] cursor-pointer text-xs md:text-sm transition-all ${
                    currentEpisode === episodeNum
                      ? 'bg-[#f5e1a0] text-[#1a2233] font-bold'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-[#f5e1a0]/30'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={() => loadEpisode(episodeNum)}
                  disabled={!episode || episode.scenes.length === 0}
                >
                  Ep {episodeNum}
                </button>
              )
            })}
          </div>
          <div className="flex flex-col items-end gap-1 md:gap-2 order-2 md:order-3">
            <div className="text-[#f5e1a0] text-xs md:text-sm">
              Level {calculateLevel(constitutionalPoints)}
            </div>
            <div className="bg-white/10 rounded-[15px] md:rounded-[20px] w-[120px] md:w-[200px] h-1.5 md:h-2 overflow-hidden border border-[#f5e1a0]/30">
              <div 
                className="bg-[#f5e1a0] h-full transition-all duration-500 rounded-[15px] md:rounded-[20px]"
                style={{ width: `${calculateLevelProgress(constitutionalPoints)}%` }}
              ></div>
            </div>
            <div className="text-[#f5e1a0] text-xs opacity-75 hidden md:block">
              {constitutionalPoints} / {calculateLevel(constitutionalPoints) * 50} points
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="flex-1 flex flex-col md:flex-row relative">
          {/* Scene Area */}
          <div className="flex-1 md:flex-2 relative overflow-hidden min-h-[200px] md:min-h-0">
            <div 
              className={`absolute inset-0 transition-all duration-800 ${
                currentSceneData?.background === 'village-bg' ? 'bg-gradient-to-b from-[#232b39] via-[#1a2233] to-[#181e26]' :
                currentSceneData?.background === 'city-bg' ? 'bg-gradient-to-b from-[#1a2233] via-[#232b39] to-[#181e26]' :
                currentSceneData?.background === 'school-bg' ? 'bg-gradient-to-b from-[#232b39] via-[#1a2233] to-[#181e26]' :
                'bg-gradient-to-b from-[#232b39] via-[#1a2233] to-[#181e26]'
              }`}
            ></div>
            
            {/* Character */}
            <div className="absolute bottom-2 md:bottom-5 left-[50px] md:left-[100px] w-[80px] md:w-[120px] h-[140px] md:h-[200px] bg-gradient-to-b from-[#8B4513] via-[#DEB887] via-[#4169E1] to-[#000080] rounded-[40px_40px_5px_5px] md:rounded-[60px_60px_10px_10px] transition-all duration-500 animate-pulse">
              <div className="absolute top-[5px] md:top-[10px] left-[15px] md:left-[20px] w-[50px] md:w-[80px] h-[50px] md:h-[80px] bg-gradient-radial from-[#DEB887] to-[#8B4513] rounded-full border-[2px] md:border-[3px] border-[#654321]"></div>
              <div className="absolute top-[20px] md:top-[30px] left-[20px] md:left-[30px] w-[40px] md:w-[60px] h-[25px] md:h-[40px] bg-black rounded-[20px_20px_0_0] md:rounded-[30px_30px_0_0]"></div>
            </div>

            {/* Constitution Corner */}
            <div className="absolute bottom-2 md:bottom-5 right-2 md:right-5 bg-[#f5e1a0]/10 backdrop-blur-[10px] border border-[#f5e1a0]/30 rounded-[10px] md:rounded-[15px] p-2 md:p-4 max-w-[200px] md:max-w-[250px] text-[#f5e1a0] text-xs md:text-sm animate-pulse">
              <div dangerouslySetInnerHTML={{ __html: currentSceneData?.tip || '' }} />
            </div>
          </div>

          {/* Dialogue Area */}
          <div className="flex-1 bg-black/60 backdrop-blur-[10px] flex flex-col">
            <div className="flex-1 p-3 md:p-6 text-white flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="text-[#f5e1a0] font-bold text-lg md:text-xl mb-2 md:mb-4 font-playfair drop-shadow-[2px_2px_4px_rgba(0,0,0,0.5)]">
                  {currentSceneData?.speaker}
                </div>
                <div className="text-base md:text-lg leading-relaxed mb-4 md:mb-6 animate-[typewriter_2s_ease-in-out] font-serif">
                  {currentSceneData?.text}
                </div>
              </div>
              
              <div className="max-h-[200px] md:max-h-[300px] overflow-y-auto flex flex-col gap-y-2 md:gap-y-3">
                {currentSceneData?.choices.map((choice, index) => (
                  <button
                    key={index}
                    className="w-full p-3 md:p-4 bg-gradient-to-r from-[#f5e1a0]/20 to-[#f5e1a0]/10 text-white border border-[#f5e1a0]/30 rounded-[8px] md:rounded-[10px] cursor-pointer text-sm md:text-base transition-all duration-200 text-left relative overflow-hidden last:mb-0
                      hover:scale-[1.035] hover:bg-white/20 hover:backdrop-blur-[2px] hover:border-[#f5e1a0] hover:shadow-[0_2px_8px_0_rgba(245,225,160,0.18)] focus:outline-none focus:ring-2 focus:ring-[#f5e1a0] focus:ring-offset-2"
                    onClick={() => makeChoice(index)}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Score Display - Moved to top right of game area, smaller size */}
        <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-[#f5e1a0]/90 text-[#1a2233] px-2 md:px-3 py-1 md:py-2 rounded-[15px] md:rounded-[20px] font-bold text-xs md:text-sm shadow-[0_5px_15px_rgba(0,0,0,0.2)] border border-[#f5e1a0]/40 z-10">
          Points: {constitutionalPoints}
        </div>
      </div>

      {/* Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black/70 z-50 transition-opacity duration-300"></div>
      )}

      {/* Article Popup */}
      {showArticle && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="relative bg-gradient-to-br from-[#f5e1a0] to-[#e2d8c0] p-4 md:p-8 rounded-[15px] md:rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] z-10 max-w-[90vw] md:max-w-[600px] max-h-[80vh] text-[#1a2233] text-center overflow-y-auto border-2 md:border-4 border-[#1a2233]">
            <div className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[#1a2233] font-playfair drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]">
              {currentArticle?.title}
            </div>
            <div className="text-base md:text-lg leading-relaxed mb-4 md:mb-6 text-left font-serif">
              {currentArticle?.text}
            </div>
            <button 
              className="bg-[#1a2233] text-[#f5e1a0] border-none p-2 md:p-3 rounded-[20px] md:rounded-[25px] cursor-pointer text-sm md:text-base transition-all hover:bg-[#232b39] hover:scale-105 font-bold"
              onClick={closeArticle}
            >
              Continue Journey
            </button>
          </div>
        </div>
      )}

      {/* Badge Display */}
      {showBadge && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#f5e1a0] to-[#e2d8c0] p-6 md:p-8 rounded-full w-[120px] h-[120px] md:w-[150px] md:h-[150px] flex items-center justify-center text-xl md:text-2xl text-[#1a2233] z-10 animate-[badge-appear_2s_ease] text-center border-2 md:border-4 border-[#1a2233] font-bold">
            {currentBadge}
          </div>
        </div>
      )}

      {/* Level Up Notification */}
      {showLevelUp && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#f5e1a0] to-[#e2d8c0] p-6 md:p-8 rounded-[20px] md:rounded-[25px] shadow-[0_20px_60px_rgba(0,0,0,0.4)] z-10 max-w-[90vw] md:max-w-[400px] text-[#1a2233] text-center border-2 md:border-4 border-[#1a2233]">
            <div className="text-3xl md:text-4xl mb-4 font-playfair">🎉</div>
            <div className="text-xl md:text-2xl font-bold mb-2 font-playfair">Level Up!</div>
            <div className="text-lg md:text-xl mb-4 font-serif">
              You've reached Level {newLevel}!
            </div>
            <div className="text-sm md:text-base opacity-75">
              Your constitutional knowledge is growing stronger!
            </div>
          </div>
        </div>
      )}

      {/* Streak Notification */}
      {showStreakNotification && (
        <StreakNotification
          message={streakMessage}
          bonus={streakBonus}
          streak={currentStreak}
          isVisible={showStreakNotification}
          onClose={() => setShowStreakNotification(false)}
        />
      )}
    </div>
  );
};

// Comprehensive fallback data for all episodes
const fallbackEpisodes: Record<number, Episode> = {
  1: {
    title: "The Awakening",
    background: "village-bg",
    scenes: [
      {
        speaker: "Aarav",
        text: "Welcome to my story! I'm Aarav, and I've just moved from my village in Rajasthan to this big city in Maharashtra. Back home, we celebrated the Constitution like a festival. But here... things are different. Are you ready to help me discover the power of our Constitutional rights?",
        background: "village-bg",
        choices: [
          { text: "🏛️ \"Yes! Let's learn about our Constitutional rights together!\"", points: 10, next: 1 },
          { text: "📚 \"Tell me more about the Constitution first\"", points: 5, next: 2 },
          { text: "🤔 \"I'm not sure... what challenges will we face?\"", points: 3, next: 3 }
        ],
        tip: "💡 <strong>Did you know?</strong><br>Article 21A guarantees free education to all children aged 6-14!"
      },
      {
        speaker: "Aarav",
        text: "Perfect! That's the spirit our Constitution needs! You know, the Constitution isn't just a book of laws - it's our shield and sword. Every article is a promise our nation made to us. Tomorrow, we'll face our first real challenge involving children's education rights.",
        background: "city-bg",
        choices: [
          { text: "🎓 \"I'm ready to defend education rights!\"", points: 15, next: "episode2" }
        ],
        tip: "💡 <strong>Fun Fact:</strong><br>India's Constitution is the longest written constitution in the world!"
      },
      {
        speaker: "Aarav",
        text: "Great question! Our Constitution has 395 articles, but the most powerful ones are called Fundamental Rights - Articles 12 to 35. They protect our equality, freedom, and dignity. Think of them as superpowers every Indian citizen has!",
        background: "village-bg",
        choices: [
          { text: "💪 \"Now I understand! Let's use these superpowers!\"", points: 12, next: 1 }
        ],
        tip: "💡 <strong>Constitutional Wisdom:</strong><br>Fundamental Rights cannot be taken away by any government!"
      },
      {
        speaker: "Aarav",
        text: "I understand your hesitation. The challenges are real - we'll face discrimination, corruption, and people who abuse power. But that's exactly why we need the Constitution! Every challenge we overcome makes our democracy stronger.",
        background: "city-bg",
        choices: [
          { text: "💪 \"You're right! Let's face these challenges together!\"", points: 8, next: 1 }
        ],
        tip: "💡 <strong>Remember:</strong><br>Article 32 is called the 'Heart of the Constitution' - it lets us approach courts directly!"
      }
    ]
  },
  2: {
    title: "Right to Learn",
    background: "school-bg",
    scenes: [
       {
        speaker: "Aarav",
        text: "Here we are at the local school. Look there - do you see Ravi and Priya? They're street children, around 8-10 years old, being turned away by the guard. He says they're 'too dirty' and would 'disturb other students.' But I know something powerful can help them...",
        background: "school-bg",
        choices: [
          { text: "📚 \"Article 21A - Right to Education! Every child deserves school!\"", points: 20, next: 1, article: "21A" },
          { text: "⚖️ \"This is discrimination! Article 14 says everyone is equal!\"", points: 15, next: 2, article: "14" },
          { text: "😢 \"This is so unfair! What can we do about it?\"", points: 5, next: 3 }
        ],
        tip: "💡 <strong>Education Rights:</strong><br>Article 21A makes education a fundamental right, not just a privilege!"
      },
      {
        speaker: "Aarav",
        text: "EXACTLY! You've mastered it! Article 21A - the Right to Education! I marched into the principal's office and said: 'Ma'am, the Constitution of India guarantees free and compulsory education to every child aged 6 to 14. You cannot deny them admission based on their economic status.'",
        background: "school-bg",
        choices: [
          { text: "👏 \"What happened next? Did she listen?\"", points: 10, next: 4 },
          { text: "📋 \"What legal backing did you have?\"", points: 15, next: 5 }
        ],
        tip: "💡 <strong>Victory:</strong><br>Article 21A has helped millions of children get access to education!"
      },
      {
        speaker: "Aarav",
        text: "You're right about equality! Article 14 is powerful, but for education specifically, Article 21A gives us the strongest foundation. Education is not just equal treatment - it's a guaranteed right for every child! Let me show you how we used it.",
        background: "school-bg",
        choices: [
          { text: "📚 \"Teach me how to use Article 21A effectively!\"", points: 15, next: 1 }
        ],
        tip: "💡 <strong>Legal Strategy:</strong><br>Different situations need different constitutional articles!"
      },
      {
        speaker: "Aarav",
        text: "I felt the same way initially. But here's the beauty of our Constitution - it doesn't just identify problems, it gives us solutions! Article 21A is our weapon against educational discrimination.",
        background: "school-bg",
        choices: [
          { text: "📚 \"Teach me about Article 21A so I can help too!\"", points: 12, next: 1, article: "21A" }
        ],
        tip: "💡 <strong>Empowerment:</strong><br>Every citizen can be a constitutional advocate!"
      },
      {
        speaker: "Principal",
        text: "She tried to ignore me at first, making excuses about 'school policy' and 'maintaining standards.' But I was prepared! I had the Right to Education Act 2009, Supreme Court judgments, and state government circulars. Knowledge became my weapon!",
        background: "school-bg",
        choices: [
          { text: "🎯 \"Amazing! Did the children get admitted?\"", points: 15, next: 6 },
          { text: "📖 \"What other legal resources can we use?\"", points: 18, next: 5 }
        ],
        tip: "💡 <strong>Preparation Power:</strong><br>Legal knowledge + research = unstoppable advocacy!"
      },
      {
        speaker: "Aarav",
        text: "I came armed with the Right to Education Act 2009, the Unnikrishnan vs State of AP Supreme Court judgment, and state government notifications. I also contacted a local NGO working on education rights. Preparation is everything in constitutional advocacy!",
        background: "school-bg",
        choices: [
          { text: "🎯 \"What was the final outcome?\"", points: 12, next: 6 }
        ],
        tip: "💡 <strong>Legal Arsenal:</strong><br>Acts + Court judgments + NGO support = Success!"
      },
      {
        speaker: "Aarav",
        text: "Victory! After two hours of constitutional arguments and legal evidence, the principal had no choice but to admit Ravi and Priya. The school even arranged for uniforms and books. Article 21A in action! We earned the 'Education Advocate' badge!",
        background: "school-bg",
        choices: [
          { text: "🎉 \"This is incredible! What's our next challenge?\"", points: 20, next: "episode3", badge: "Education Advocate 🎓" }
        ],
        tip: "💡 <strong>Real Impact:</strong><br>Constitutional knowledge creates real change in people's lives!"
      }
    ]
  },
  3: { title: "Voice of the People", background: "market-bg", scenes: [] },
  4: { title: "Justice for All", background: "court-bg", scenes: [] },
  5: { title: "A Fair Wage", background: "factory-bg", scenes: [] },
  6: { title: "Land of Our Fathers", background: "farm-bg", scenes: [] },
  7: { title: "The Power of Information", background: "office-bg", scenes: [] },
  8: { title: "Becoming a Guardian", background: "parliament-bg", scenes: [] },
};

export default ConstitutionChronicles; 