import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

interface IFavoriteItem {
  movieId: number;
  title: string;
  thumbnail: string;
  IMDB_Rating: number;
}

interface IWatchLaterItem {
  movieId: number;
  title: string;
  thumbnail: string;
  IMDB_Rating: number;
}

interface IRatingItem {
  movieId: number;
  rating: number;
}

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePic: string;
  fullName: string;
  isActive: boolean;
  deactivatedAt: Date | null;
  favorites: IFavoriteItem[];
  watchLater: IWatchLaterItem[];
  ratings: IRatingItem[];
  comparePassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true
    },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String },
    isActive: { type: Boolean, default: true },
    deactivatedAt: { type: Date, default: null },

    favorites: [
      {
        movieId: { type: Number, required: true },
        title: { type: String, required: true },
        thumbnail: { type: String, required: true },
        IMDB_Rating: { type: Number, required: true }
      }
    ],
    watchLater: [
      {
        movieId: { type: Number, required: true },
        title: { type: String, required: true },
        thumbnail: { type: String, required: true },
        IMDB_Rating: { type: Number, required: true }
      }
    ],
    ratings: [
      {
        movieId: { type: Number, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
