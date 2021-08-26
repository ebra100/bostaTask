
export interface IUserRepo {

    getUserByField(fieldValue, fieldName)
    createUser(userData);
}