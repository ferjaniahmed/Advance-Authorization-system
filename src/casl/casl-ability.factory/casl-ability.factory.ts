import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, createMongoAbility } from "@casl/ability";
import { Injectable } from "@nestjs/common";
import { BookEntity } from "../../books/entities/book.entity";
import { UserEntity } from "../../users/entities/user.entity";
import { Actions } from "../actions";


export const isAdmin = (user: UserEntity): boolean => {
    const value: string | undefined = user.role.find((value) => value === "admin");
    return value ? true : false;
}

type Subjects = InferSubjects<typeof UserEntity | typeof BookEntity > | 'all';
export type AppAbility = Ability<[Actions, Subjects]>;

@Injectable()
export class CaslAbilityFactory {

    createForUser(user : UserEntity){
        const {can , cannot , build} = new AbilityBuilder<
        Ability<[Actions, Subjects]>>(Ability as AbilityClass<AppAbility>)
        if (isAdmin(user)) {
            can(Actions.Manage, 'all'); 
        } else {
            can(Actions.Read, 'all');
            can(Actions.Create, UserEntity);
            can(Actions.Update, UserEntity , {_id :user._id});
            can(Actions.Create, BookEntity);
            can(Actions.Update, BookEntity , {authorId : user._id});
            can(Actions.Delete, BookEntity , {authorId:user._id});  
            cannot(Actions.Delete, UserEntity);
        }

        return build({
            detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
        })

    }

}
