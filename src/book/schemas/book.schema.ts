import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';
import { Category } from '../../shared/enums/category.enum';


@Schema()
export class Book {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  author: string;

  @Prop()
  price: number;

  @Prop()
  category: Category

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: User

}

export const BookSchema = SchemaFactory.createForClass(Book);