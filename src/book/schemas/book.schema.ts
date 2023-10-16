
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum Category  {
  ADVENTURE = 'Adventure',
  CALSSICS = 'Calssics',
  CRIME = 'Crime',
  FANTASY = 'Fantasy'
}

@Schema()
export class Book {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ required: [true, 'Author is required'] })
  author: string;

  @Prop()
  price: number;

  @Prop()
  category: Category

}

export const BookSchema = SchemaFactory.createForClass(Book);
