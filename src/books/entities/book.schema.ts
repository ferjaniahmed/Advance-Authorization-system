import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/users/entities/user.schema";


export type BookDocument = HydratedDocument<Book>

@Schema()
export class Book {
    @Prop()
    _id  : mongoose.ObjectId
    @Prop()
    name : string
    @Prop()
    photo : string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    authorId: User;
}

export const BookSchema = SchemaFactory.createForClass(Book)