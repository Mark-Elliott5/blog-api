import { getModelForClass } from '@typegoose/typegoose';
import { Article, Author, Comment } from './Classes';

const ArticleModel = getModelForClass(Article);

const AuthorModel = getModelForClass(Author);

const CommentModel = getModelForClass(Comment);

export { ArticleModel, AuthorModel, CommentModel };
