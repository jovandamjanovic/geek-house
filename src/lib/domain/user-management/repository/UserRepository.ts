import {EntityRepository} from "@/lib/domain/clan-management/repository/EntityRepository";
import {User} from "@/types";


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserRepository extends Omit<EntityRepository<User>, 'save' | 'delete'> {
}