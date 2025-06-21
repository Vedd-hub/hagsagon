import { firestoreService } from '../services';

const episodes = {
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
      title: "The Right to Learn",
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
                  { text: "📚 \"Teach me how to use Article 21A effectively!\"", points: 15, next: 4 }
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
                  { text: "📖 \"What other legal resources can we use?\"", points: 18, next: 7 }
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
    }
  };

  export const uploadConstitutionChroniclesData = async () => {
    console.log("Uploading Constitution Chronicles data to Firestore...");
    try {
      for (const episodeId in episodes) {
        await firestoreService.update('constitution-chronicles', episodeId, (episodes as any)[episodeId]);
      }
      console.log("Successfully uploaded Constitution Chronicles data.");
    } catch (error) {
      console.error("Error uploading Constitution Chronicles data:", error);
    }
  };
  
// Note: To run this, you could temporarily call this function in a component like App.tsx,
// or create a dedicated script that can be run from the command line.
// For example, in App.tsx:
//
// import { uploadConstitutionChroniclesData } from './utils/upload-game-data';
//
// function App() {
//   useEffect(() => {
//     // This will run once when the app loads.
//     // Remember to remove it after the data has been uploaded.
//     uploadConstitutionChroniclesData();
//   }, []);
//   ...
// } 