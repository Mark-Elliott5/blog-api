import { prop, getModelForClass } from '@typegoose/typegoose';

class Comment {
  @prop({ required: true })
  author!: string;

  @prop({ required: true })
  date!: Date;

  @prop({ required: true })
  content!: string;
}

const CommentModel = getModelForClass(Comment);

export { Comment, CommentModel };
