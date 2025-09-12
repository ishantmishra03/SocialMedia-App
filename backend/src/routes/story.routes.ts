import { Router } from 'express';
import StoryController from '../controllers/story.controller';
import { authVerify } from '../middlewares/authVerify';
import upload from '../utils/multer';

const storyRouter = Router();

storyRouter.post('/', authVerify, upload.single('media'), StoryController.createStory);
storyRouter.get('/', StoryController.getAllStories);
storyRouter.get('/user/:userId', StoryController.getStoriesByUser);
storyRouter.post('/:storyId/view', authVerify, StoryController.viewStory);
storyRouter.post('/:storyId/like', authVerify, StoryController.likeStory);
storyRouter.post('/:storyId/unlike', authVerify, StoryController.unlikeStory);
storyRouter.delete('/:storyId', authVerify, StoryController.deleteStory);

export default storyRouter;
