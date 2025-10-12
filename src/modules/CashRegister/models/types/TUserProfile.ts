export type TUserProfile = {
  id: number
  name: string;
  role_id: number;
  role : {
    id: number;
    name:string
  }
};