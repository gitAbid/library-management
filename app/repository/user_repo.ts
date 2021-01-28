import IUser from "../interface/user";
import User from "../model/user";

export default class UserReposition {

    findAllUser(callback: Function) {
        User.find()
            .exec()
            .then((user) => {
                callback(user, null);
            })
            .catch((err) => {
                console.error(err);
                callback(null, err);
            });
    }

    findByUsername = (username: string, callback: Function) => {
        User.findOne({username: username})
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
        User.findOne({username: username, password: password})
            .exec()
            .then((user) => {
                callback(user, null);
            })
            .catch((err) => {
                console.error(err);
                callback(null, err);
            });
    };

    save = (user: IUser, callback: Function) => {
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

    findByIdAndUpdate = (id: string, user: IUser, callback: Function) => {
        User.findOneAndUpdate(
            {_id: id},
            {$set: user},
            {new: true, runValidators: false}
        )
            .then((savedBook) => {
                callback(savedBook, null);
            })
            .catch((error) => {
                console.log(error);
                callback(null, error);
            });
    };
}
