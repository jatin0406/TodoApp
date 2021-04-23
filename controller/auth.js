import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signUp = async(req, res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password) {
            return res.status(405).json({message: "Username or Password is Missing!"});
        }

        const hash = await bcrypt.hash(password, 12);

        const user = await User.create({
            username,
            password: hash
        });

        delete user._doc.password;
        return res.status(200).json({message: "Account Created", data: user});
    } catch(error) {
        if(error.code === 11000) {
            return res.status(404).json({message: "Username already exist"});    
        }
        return res.status(404).json({message: error.message});
    }
}

export const signIn = async(req, res) => {
    try {
        const { username, password } = req.body;

        if(!username || !password) {
            return res.status(422).json({message: "Username or Password is Missing!"});
        }

        const user = await User.findOne({username: username});

        if (!user) {
            return res.status(403).json({message: 'Invalid Username or Password!'});
        }

        const matched = await bcrypt.compare(password, user.password);

        if (!matched) {
            return res.status(403).json({message: 'Invalid Username or Password!'});
        }

        delete user._doc.password;
        const token = jwt.sign({ userID: user._id }, process.env.JWT_KEY);
        return res.status(200).json({message: "Login Successfully", data: user, token});

    } catch(error) {
        return res.status(404).json({message: error.message});
    }
}

export const verifyToken = async(req, res) => {
    try {
        const { token } = req.params;

        if(!token) {
            return res.status(422).json({message: "Token Missing!"});
        }

        const data = jwt.verify(token, process.env.JWT_KEY);

        return res.status(200).json({userID: data.userID});
    } catch(error) {
        return res.status(404).json({message: error.message});
    }
}