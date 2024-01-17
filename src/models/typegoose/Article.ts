import { prop, Ref, getModelForClass } from '@typegoose/typegoose';
import { Comment } from './Comment';

class Article {
  @prop({ required: true })
  title!: string;

  @prop({ required: true })
  author!: string;

  @prop({ required: true })
  date!: Date;

  @prop({ required: true })
  content!: string;

  @prop({ ref: () => Comment })
  comments!: Ref<Comment>[];
}

const ArticleModel = getModelForClass(Article);

export { Article, ArticleModel };
