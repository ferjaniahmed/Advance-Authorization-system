import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PolicyHandler } from "src/casl/casl-ability.factory/IpolicyHandler ";
import { AppAbility, CaslAbilityFactory } from "src/casl/casl-ability.factory/casl-ability.factory";
import { CHECK_POLICIES_KEY } from "src/decorators/check-policies .decorator";
import { UserEntity } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class RoleGuard implements CanActivate {
    
    constructor(private reflector : Reflector , 
        private caslAbility : CaslAbilityFactory , 
        private userService : UsersService){}


    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyHandlers =
        this.reflector.get<PolicyHandler[]>(
          CHECK_POLICIES_KEY,
          context.getHandler(),
        ) || [];
  
        const {user} = context.switchToHttp().getRequest();

        const currentUser : UserEntity = await this.userService.findOne(user._id) as unknown as UserEntity
        const ability = this.caslAbility.createForUser(currentUser);
        return policyHandlers.every((handler) =>
            this.execPolicyHandler(handler, ability),
        );
    }

    private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
        if (typeof handler === 'function') {
          return handler(ability);
        }
        return handler.handle(ability);
      }
}