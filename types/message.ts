import firebase from 'firebase';

export type Message = {
  text: string;
  createdAt: firebase.firestore.Timestamp;
  userId: string;
};

export type Position = {
  text: string;
  userId: string;
  x: number;
  y: number;
};
