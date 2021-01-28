import IUser from "../interface/user";
import User from "../model/user";

export default class UserReposition {
  findByUsername = (username: string, callback: Function) => {
    User.findOne({ username: username })
      .exec()
      .then((user) => {
        callback(user, null);
      })
      .catch((err) => {
        console.error(err);
        callback(null, err);
      });
  };

  findByUsernameAndPassword = (
    username: string,
    password: string,
    callback: Function
  ) => {
    User.findOne({ username: username, password: password })
      .exec()
      .then((user) => {
        callback(user, null);
      })
      .catch((err) => {
        console.error(err);
        callback(null, err);
      });
  };

  update = (user: IUser, callback: Function) => {
    user
      .save()
      .then((user) => {
        callback(user, null);
      })
      .catch((err) => {
        console.error(err);
        callback(null, err);
      });
  };
}
