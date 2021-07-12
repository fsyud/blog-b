declare namespace API {
  type userInfo = {
    name: string;
    password: string;
  };
  type artParams = {
    title: string;
    content: string;
    type: number;
    author: string;
  };
  type reponseData = {
    code: number;
    data: any[];
    message: string;
  };
}
