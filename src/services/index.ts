import { FirestoreService } from './firestore.service';
import { UserService } from './user.service';
import { ChapterService, QuizService, LexIQService, AnnouncementService } from './content.service';

// Create instances of services
export const firestoreService = new FirestoreService();
export const userService = new UserService();
export const chapterService = new ChapterService();
export const quizService = new QuizService();
export const lexiqService = new LexIQService();
export const announcementService = new AnnouncementService();

// Export service classes
export { 
  FirestoreService, 
  UserService,
  ChapterService,
  QuizService,
  LexIQService,
  AnnouncementService
}; 