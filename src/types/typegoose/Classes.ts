// /* eslint-disable @typescript-eslint/no-use-before-define */
// /* eslint-disable max-classes-per-file */
// // Necessary to break these rules to avoid dependency cycles

// import { prop, Ref } from '@typegoose/typegoose';

// class Article {
//   @prop({ required: true })
//   title!: string;

//   @prop({ required: true, ref: () => Author })
//   author!: Ref<Author>;

//   @prop({ required: true })
//   date!: Date;

//   @prop({ required: true })
//   content!: string;

//   @prop({ required: true, type: () => [Comment] })
//   comments!: Comment[];
// }

// class Author {
//   @prop({ required: true })
//   name!: string;

//   @prop({ required: true, type: () => [Article] })
//   articles!: Article[];

//   // @prop({ required: true })
//   // blogger!: boolean;
// }

// class Comment {
//   @prop({ required: true })
//   author!: string;

//   @prop({ required: true })
//   date!: Date;

//   @prop({ required: true })
//   content!: string;

//   @prop({ required: true, ref: () => Article })
//   article!: Ref<Article>;
// }

// export { Article, Author, Comment };
