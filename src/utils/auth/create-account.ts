import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import memoryStore from './memoryStore';
import bcrypt from 'bcryptjs';

const createAccount = async (req: Request, res: Response) => {
  try {
    const { code, email } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }

    const storedRaw = memoryStore.get(`prechecked:${email}`);
    const stored = typeof storedRaw === 'string' ? JSON.parse(storedRaw) : storedRaw;

    if (!stored) {
      return res.status(400).json({ message: "No pending verification found for this email" });
    }

    if (stored.code != code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    const hashedPassword = await bcrypt.hash(stored.password, 10);
    const newUser = new User({
      username: stored.username,
      fullname: stored.fullname,
      password: hashedPassword,
      email: stored.email,
      avatarImage: 'https://res.cloudinary.com/dvfl0oxmj/image/upload/v1746372697/gbbju93p0xiwunwz8hie.gif'
    });

    await newUser.save();
    memoryStore.delete(`prechecked:${email}`);

    return res.status(201).json({ message: "Account created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default createAccount;
