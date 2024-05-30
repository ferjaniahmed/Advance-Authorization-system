import { UserEntity } from '../../users/entities/user.entity';
import { CaslAbilityFactory, isAdmin } from './casl-ability.factory';
import { Actions } from '../actions';
import { BookEntity } from '../../books/entities/book.entity';
import { mock } from 'node:test';

describe('CaslAbilityFactory', () => {

  let user : UserEntity ={
    _id: '1',
    username: 'ahmed',
    email: 'ahmed@gmail.com',
    password: '12345',
    role: ["admin"]
  }

  it('should be defined', () => {
    expect(new CaslAbilityFactory()).toBeDefined();
  });

  describe("when user is an admin" ,()=>{
    it("can do anything" , ()=>{
      const ability = new CaslAbilityFactory().createForUser(user);
      const canManageAll = ability.rules.some(
        (rule) => rule.action === Actions.Manage && rule.subject === 'all'
      );
      expect(canManageAll).toEqual(true);
    })
  })

  describe("when user is an simple user" ,()=>{
    beforeEach(()=>{
      user.role = ["client"]

    })
    it("can create User" , ()=>{
      const ability = new CaslAbilityFactory().createForUser(user);
      const canManageAll = ability.rules.some(
        (rule) => rule.action === Actions.Create && rule.subject === UserEntity
      );
      expect(canManageAll).toEqual(true);
    })

    it("can read all subject " , ()=>{
      const ability = new CaslAbilityFactory().createForUser(user);
      const createUser = ability.rules.some(
        (rule) => rule.action === Actions.Read && rule.subject === "all"
      );
      expect(createUser).toEqual(true);
    })

    it("can update user  " , ()=>{
      const ability = new CaslAbilityFactory().createForUser(user);
      const mockUser : UserEntity  = {
        ...user ,
        _id : "new User ID",
        role: ["client"]
      }
      const canUpdateHisOwnObject = ability.rules.some(
        (rule) => rule.action === Actions.Update && rule.subject === UserEntity 
      );
      const canUpdateOtherOject = ability.can(Actions.Update , mockUser)

      expect(canUpdateHisOwnObject).toEqual(true);
      expect(canUpdateOtherOject).toEqual(false);
    })

    it("cannot Delete User " , ()=>{
      const ability = new CaslAbilityFactory().createForUser(user);
      const deleteUser = ability.rules.some(
        (rule) => rule.action === Actions.Delete && rule.subject === UserEntity
      );
      const canDeleteOtherOject = ability.can(Actions.Delete , user)

      expect(deleteUser).toEqual(true);
      expect(canDeleteOtherOject).toEqual(false);
      
    })
    it("cannot create book " , ()=>{
      const ability = new CaslAbilityFactory().createForUser(user);
      const createBook = ability.rules.some(
        (rule) => rule.action === Actions.Create && rule.subject === BookEntity
      );
      const canCreateBook = ability.can(Actions.Create , BookEntity)
      
      expect(createBook).toEqual(true);
      expect(canCreateBook).toEqual(true);
      
    })

    it("can update book " , ()=>{

      const ability = new CaslAbilityFactory().createForUser(user);

      const mockBook : BookEntity = {
        _id  :"bookId",
        name: 'book name',
        image: 'image',
        authorId: '1'
      }

      const updateBook = ability.rules.some(
        (rule) => rule.action === Actions.Update && rule.subject === BookEntity
      );
      
      expect(updateBook).toEqual(true);
      
    })

    it("can delete book " , ()=>{

      const ability = new CaslAbilityFactory().createForUser(user);

      const mockBook : BookEntity = {
        _id  :"bookId",
        name: 'book name',
        image: 'image',
        authorId: '1'
      }

      const deleteBook = ability.rules.some(
        (rule) => rule.action === Actions.Delete && rule.subject === BookEntity
      );
      expect(deleteBook).toEqual(true); 
      
      })
    }

  )}
);
